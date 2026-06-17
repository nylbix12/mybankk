<?php

namespace App\Tests\Api;

class CategoryTest extends ApiTestCase
{
    public function test_create_category_returns_201(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();

        $this->json($client, 'POST', '/api/categories', $token, [
            'title' => 'Groceries',
            'color' => '#00C49A',
        ]);

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame('Groceries', $data['title']);
        $this->assertSame('#00C49A', $data['color']);
    }

    public function test_list_categories_returns_own_categories_only(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();

        $this->json($client, 'POST', '/api/categories', $token, ['title' => 'Transport', 'color' => '#156064']);
        $this->json($client, 'GET', '/api/categories', $token);

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $titles = array_column($data, 'title');
        $this->assertContains('Transport', $titles);
    }

    public function test_update_category(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();

        $this->json($client, 'POST', '/api/categories', $token, ['title' => 'Health', 'color' => '#ef4444']);
        $created = json_decode($client->getResponse()->getContent(), true);

        $this->json($client, 'PUT', '/api/categories/' . $created['id'], $token, ['title' => 'Healthcare']);

        $this->assertResponseIsSuccessful();
        $updated = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame('Healthcare', $updated['title']);
    }

    public function test_delete_empty_category_returns_204(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();

        $this->json($client, 'POST', '/api/categories', $token, ['title' => 'ToDelete', 'color' => '#156064']);
        $created = json_decode($client->getResponse()->getContent(), true);

        $this->json($client, 'DELETE', '/api/categories/' . $created['id'], $token);

        $this->assertResponseStatusCodeSame(204);
    }

    public function test_delete_category_with_operations_returns_422(): void
    {
        ['client' => $client, 'token' => $token] = $this->registerAndLogin();

        $this->json($client, 'POST', '/api/categories', $token, ['title' => 'WithOps', 'color' => '#00C49A']);
        $category = json_decode($client->getResponse()->getContent(), true);

        $this->json($client, 'POST', '/api/operations', $token, [
            'label'      => 'Test expense',
            'amount'     => 25.00,
            'date'       => '2026-01-15',
            'categoryId' => $category['id'],
        ]);

        $this->json($client, 'DELETE', '/api/categories/' . $category['id'], $token);

        $this->assertResponseStatusCodeSame(422);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame('cannot_delete', $data['error']);
    }
}
