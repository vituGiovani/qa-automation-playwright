-- Modelo relacional usado para validar os dados de carrinhos vindos da API.
CREATE TABLE carts (
  id               INTEGER PRIMARY KEY,
  user_id          INTEGER NOT NULL,
  total            REAL    NOT NULL,
  discounted_total REAL    NOT NULL,
  total_products   INTEGER NOT NULL,
  total_quantity   INTEGER NOT NULL
);

CREATE TABLE cart_items (
  cart_id    INTEGER NOT NULL REFERENCES carts(id),
  product_id INTEGER NOT NULL,
  title      TEXT    NOT NULL,
  price      REAL    NOT NULL,
  quantity   INTEGER NOT NULL,
  total      REAL    NOT NULL
);
