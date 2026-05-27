FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    icu-dev \
    oniguruma-dev \
    libzip-dev \
    zip \
    unzip \
    openssl

RUN docker-php-ext-install \
    pdo_mysql \
    intl \
    zip \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Installer les dépendances SANS exécuter les scripts post-install
# (bin/console n'existe pas encore à cette étape)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copier tout le code source
COPY . .

# Regénérer l'autoload et vider le cache maintenant que bin/console existe
RUN composer dump-autoload --no-dev --optimize && \
    php bin/console cache:clear --env=prod --no-debug || true

RUN chown -R www-data:www-data var/

CMD ["php-fpm"]
