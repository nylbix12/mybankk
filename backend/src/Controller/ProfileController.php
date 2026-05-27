<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ProfileController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(SerializerInterface $serializer): JsonResponse
    {
        return $this->json(
            json_decode($serializer->serialize($this->getUser(), 'json', ['groups' => ['user:read']]))
        );
    }
}
