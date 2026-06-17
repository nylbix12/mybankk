<?php

namespace App\Tests\Api;

class OperationTest extends ApiTestCase
{
    private function createCategoryAndOperation(mixed $client, string $token): array
    {
        $this->json($client, 'POST', '/api/categories', $token, ['title' => 'Food', 'color' => '#00C49A']);
        $category = json_decode($client->getResponse()->getContent(), true);

        $this->json($client, 'POST', '/api/operations', $token, [
            'label'      => 'Supermarket',
            'amount'     => 42.50,
            'date'       => '2026-01-10',
            'categoryId' => $category['id'],
        ]);
        $operation = json_decode($client->getResponse()->getContent(), true);

        return ['category' => $category, 'operation' => $operation];
    }

    public function test_create_operation_returns_201(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();
        ['operation' => $operation] = $this->createCategoryAndOperation($client, $token);

        $this->assertResponseStatusCodeSame(201);
        $this->assertSame('Supermarket', $operation['label']);
        $this->assertSame('42.50', $operation['amount']);
    }

    public function test_list_operations_returns_created_operation(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();
        $this->createCategoryAndOperation($client, $token);

        $this->json($client, 'GET', '/api/operations', $token);

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $labels = array_column($data, 'label');
        $this->assertContains('Supermarket', $labels);
    }

    public function test_update_operation(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();
        ['operation' => $operation] = $this->createCategoryAndOperation($client, $token);

        $this->json($client, 'PUT', '/api/operations/' . $operation['id'], $token, [
            'label'  => 'Restaurant',
            'amount' => 18.00,
        ]);

        $this->assertResponseIsSuccessful();
        $updated = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame('Restaurant', $updated['label']);
        $this->assertSame('18.00', $updated['amount']);
    }

    public function test_delete_operation_returns_204(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();
        ['operation' => $operation] = $this->createCategoryAndOperation($client, $token);

        $this->json($client, 'DELETE', '/api/operations/' . $operation['id'], $token);

        $this->assertResponseStatusCodeSame(204);
    }

    public function test_create_operation_with_invalid_category_returns_422(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();

        $this->json($client, 'POST', '/api/operations', $token, [
            'label'      => 'Bad',
            'amount'     => 10.00,
            'date'       => '2026-01-10',
            'categoryId' => 99999,
        ]);

        $this->assertResponseStatusCodeSame(422);
    }
}
