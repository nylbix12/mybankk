<?php

namespace App\Controller;

use App\Entity\Operation;
use App\Repository\CategoryRepository;
use App\Repository\OperationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/operations', name: 'api_operation_')]
class OperationController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(OperationRepository $repo, SerializerInterface $serializer): JsonResponse
    {
        $operations = $repo->findBy(
            ['user' => $this->getUser()],
            ['date' => 'DESC']
        );
        return $this->json(
            json_decode($serializer->serialize($operations, 'json', ['groups' => ['operation:read']]))
        );
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        CategoryRepository $categoryRepo,
        ValidatorInterface $validator,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $category = $categoryRepo->find($data['categoryId'] ?? 0);
        if (!$category || $category->getUser() !== $this->getUser()) {
            return $this->json(['errors' => ['categoryId' => 'Invalid category.']], 422);
        }

        $operation = new Operation();
        $operation->setLabel($data['label'] ?? '');
        $operation->setAmount((string) ($data['amount'] ?? 0));
        $operation->setCategory($category);
        $operation->setUser($this->getUser());

        try {
            $operation->setDate(new \DateTime($data['date'] ?? ''));
        } catch (\Exception) {
            return $this->json(['errors' => ['date' => 'Invalid date format.']], 422);
        }

        $errors = $validator->validate($operation);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 422);
        }

        $em->persist($operation);
        $em->flush();

        return $this->json(
            json_decode($serializer->serialize($operation, 'json', ['groups' => ['operation:read']])),
            201
        );
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        Operation $operation,
        Request $request,
        EntityManagerInterface $em,
        CategoryRepository $categoryRepo,
        ValidatorInterface $validator,
        SerializerInterface $serializer
    ): JsonResponse {
        if ($operation->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['label'])) {
            $operation->setLabel($data['label']);
        }
        if (isset($data['amount'])) {
            $operation->setAmount((string) $data['amount']);
        }
        if (isset($data['date'])) {
            try {
                $operation->setDate(new \DateTime($data['date']));
            } catch (\Exception) {
                return $this->json(['errors' => ['date' => 'Invalid date format.']], 422);
            }
        }
        if (isset($data['categoryId'])) {
            $category = $categoryRepo->find($data['categoryId']);
            if (!$category || $category->getUser() !== $this->getUser()) {
                return $this->json(['errors' => ['categoryId' => 'Invalid category.']], 422);
            }
            $operation->setCategory($category);
        }

        $errors = $validator->validate($operation);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 422);
        }

        $em->flush();

        return $this->json(
            json_decode($serializer->serialize($operation, 'json', ['groups' => ['operation:read']]))
        );
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Operation $operation, EntityManagerInterface $em): JsonResponse
    {
        if ($operation->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $em->remove($operation);
        $em->flush();

        return $this->json(null, 204);
    }
}
