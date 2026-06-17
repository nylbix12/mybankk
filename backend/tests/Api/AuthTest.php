<?php

namespace App\Tests\Api;

class AuthTest extends ApiTestCase
{
    public function test_register_returns_201(): void
    {
        $client = static::createClient();
        $email = 'register_' . uniqid() . '@mybank.test';

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => $email, 'firstName' => 'Jane', 'lastName' => 'Doe', 'password' => 'password123'])
        );

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame($email, $data['email']);
    }

    public function test_register_duplicate_email_returns_422(): void
    {
        $client = static::createClient();
        $email = 'dup_' . uniqid() . '@mybank.test';
        $payload = json_encode(['email' => $email, 'firstName' => 'Jane', 'lastName' => 'Doe', 'password' => 'password123']);

        $client->request('POST', '/api/auth/register', [], [], ['CONTENT_TYPE' => 'application/json'], $payload);
        $client->request('POST', '/api/auth/register', [], [], ['CONTENT_TYPE' => 'application/json'], $payload);

        $this->assertResponseStatusCodeSame(422);
    }

    public function test_login_returns_token(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();

        $this->assertNotNull($token);
        $this->assertIsString($token);
    }

    public function test_login_wrong_password_returns_401(): void
    {
        $client = static::createClient();
        $email = 'wrong_' . uniqid() . '@mybank.test';

        $client->request(
            'POST',
            '/api/auth/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => $email, 'firstName' => 'Jane', 'lastName' => 'Doe', 'password' => 'correctpass'])
        );

        $client->request(
            'POST',
            '/api/auth/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['email' => $email, 'password' => 'wrongpass'])
        );

        $this->assertResponseStatusCodeSame(401);
    }

    public function test_protected_route_without_token_returns_401(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/operations', [], [], ['CONTENT_TYPE' => 'application/json']);
        $this->assertResponseStatusCodeSame(401);
    }
}
