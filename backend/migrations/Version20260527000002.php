<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260527000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add color column to category table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE category ADD color VARCHAR(7) NOT NULL DEFAULT '#00C49A'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE category DROP COLUMN color');
    }
}
