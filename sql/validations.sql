-- Cada consulta retorna as LINHAS INCONSISTENTES. Resultado vazio = dados íntegros.
-- "-- bug: BUG-XX" marca um defeito conhecido: o teste é tratado como falha esperada (test.fail).

-- SQL-01: total do carrinho deve ser a soma de (preço x quantidade) dos itens
-- name: total_divergente
SELECT c.id, c.total, ROUND(SUM(i.price * i.quantity), 2) AS total_calculado
FROM carts c JOIN cart_items i ON i.cart_id = c.id
GROUP BY c.id
HAVING ABS(c.total - SUM(i.price * i.quantity)) > 0.05;

-- SQL-02: quantidade de produtos distintos deve bater com os itens
-- name: produtos_divergentes
SELECT c.id, c.total_products, COUNT(i.product_id) AS itens
FROM carts c JOIN cart_items i ON i.cart_id = c.id
GROUP BY c.id
HAVING c.total_products <> COUNT(i.product_id);

-- SQL-03: quantidade total deve ser a soma das quantidades dos itens
-- name: quantidade_divergente
SELECT c.id, c.total_quantity, SUM(i.quantity) AS soma
FROM carts c JOIN cart_items i ON i.cart_id = c.id
GROUP BY c.id
HAVING c.total_quantity <> SUM(i.quantity);

-- SQL-04: total com desconto nunca pode ser maior que o total
-- name: desconto_invalido
SELECT id, total, discounted_total
FROM carts
WHERE discounted_total > total + 0.01;

-- SQL-05: o mesmo produto não deve aparecer duas vezes no mesmo carrinho
-- name: itens_duplicados
-- bug: BUG-04
SELECT cart_id, product_id, COUNT(*) AS ocorrencias
FROM cart_items
GROUP BY cart_id, product_id
HAVING COUNT(*) > 1;

-- SQL-06: itens com preço ou quantidade inválidos
-- name: itens_invalidos
SELECT cart_id, product_id, price, quantity
FROM cart_items
WHERE price <= 0 OR quantity <= 0;
