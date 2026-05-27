<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/categories', name: 'api_category_')]
class CategoryController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(CategoryRepository $repo, SerializerInterface $serializer): JsonResponse
    {
        $categories = $repo->findBy(['user' => $this->getUser()]);
        return $this->json(
            json_decode($serializer->serialize($categories, 'json', ['groups' => ['category:read']]))
        );
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $category = new Category();
        $category->setTitle($data['title'] ?? '');
        $category->setUser($this->getUser());

        $errors = $validator->validate($category);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 422);
        }

        $em->persist($category);
        $em->flush();

        return $this->json(
            json_decode($serializer->serialize($category, 'json', ['groups' => ['category:read']])),
            201
        );
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(
        Category $category,
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        SerializerInterface $serializer
    ): JsonResponse {
        if ($category->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['title'])) {
            $category->setTitle($data['title']);
        }

        $errors = $validator->validate($category);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 422);
        }

        $em->flush();

        return $this->json(
            json_decode($serializer->serialize($category, 'json', ['groups' => ['category:read']]))
        );
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Category $category, EntityManagerInterface $em): JsonResponse
    {
        if ($category->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $em->remove($category);
        $em->flush();

        return $this->json(null, 204);
    }
}
