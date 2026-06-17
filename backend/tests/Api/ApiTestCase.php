<?php

namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

abstract class ApiTestCase extends WebTestCase
{
    protected function registerAndLogin(): array
    {
        $client = static::createClient();
        $email = 'test_' . uniqid() . '@mybank.test';
        $password = 'password123';

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => $email, 'firstName' => 'Test', 'lastName' => 'User', 'password' => $password])
        );

        $client->request(
            'POST',
            '/api/auth/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => $email, 'password' => $password])
        );

        $data = json_decode($client->getResponse()->getContent(), true);

        return [
            'client' => $client,
            'token'  => $data['token'] ?? null,
            'email'  => $email,
        ];
    }

    protected function authHeaders(string $token): array
    {
        return [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
            'CONTENT_TYPE'       => 'application/json',
        ];
    }

    protected function json(KernelBrowser $client, string $method, string $url, string $token, array $body = []): void
    {
        $client->request(
            $method,
            $url,
            [],
            [],
            $this->authHeaders($token),
            $body ? json_encode($body) : null
        );
    }
}
