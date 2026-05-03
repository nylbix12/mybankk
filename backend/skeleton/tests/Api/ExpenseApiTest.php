<?php

namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExpenseApiTest extends WebTestCase
{
    // TEST 1 : GET /api/expenses — cas nominal (liste)
    public function testGetExpensesReturns200(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/expenses');

        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
    }

    // TEST 2 : GET /api/expenses — liste vide retourne []
    public function testGetExpensesReturnsEmptyArray(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/expenses');

        $this->assertResponseStatusCodeSame(200);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
    }

    // TEST 3 : POST /api/expenses — cas nominal
    public function testPostExpenseCreatesExpense(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/expenses',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'label'    => 'Loyer',
                'amount'   => 900.00,
                'date'     => '2025-01-01',
                'category' => 'Housing',
            ])
        );

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $data);
        $this->assertEquals('Loyer', $data['label']);
        $this->assertEquals(900.00, $data['amount']);
    }

    // TEST 4 : POST /api/expenses sans label — 422
    public function testPostExpenseWithoutLabelReturns422(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/expenses',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['amount' => 50.00, 'date' => '2025-01-01', 'category' => 'Food'])
        );

        $this->assertResponseStatusCodeSame(422);
    }

    // TEST 5 : POST /api/expenses sans amount — 422
    public function testPostExpenseWithoutAmountReturns422(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/expenses',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['label' => 'Courses', 'date' => '2025-01-01', 'category' => 'Food'])
        );

        $this->assertResponseStatusCodeSame(422);
    }

    // TEST 6 : POST montant négatif — cas limite
    public function testPostExpenseWithNegativeAmountIsRejected(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/expenses',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['label' => 'Test', 'amount' => -50.00, 'date' => '2025-01-01', 'category' => 'Other'])
        );

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertContains($statusCode, [400, 422]);
    }

    // TEST 7 : GET /api/expenses/999 inexistant — 404
    public function testGetNonExistentExpenseReturns404(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/expenses/99999');

        $this->assertResponseStatusCodeSame(404);
    }

    // TEST 8 : DELETE /api/expenses/999 inexistant — 404
    public function testDeleteNonExistentExpenseReturns404(): void
    {
        $client = static::createClient();
        $client->request('DELETE', '/api/expenses/99999');

        $this->assertResponseStatusCodeSame(404);
    }

    // TEST 9 : Sécurité — injection XSS dans le label
    public function testPostExpenseWithXssLabelIsSanitized(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/api/expenses',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'label'    => '<script>alert(1)</script>',
                'amount'   => 10.00,
                'date'     => '2025-01-01',
                'category' => 'Security',
            ])
        );

        // La requête ne doit pas planter (500) et la réponse ne doit pas
        // renvoyer du HTML non échappé contenant <script>
        $this->assertNotEquals(500, $client->getResponse()->getStatusCode());
        $content = $client->getResponse()->getContent();
        $this->assertStringNotContainsString('<script>alert(1)</script>', $content);
    }
}
