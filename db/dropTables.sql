-- Eliminar las tablas en orden inverso de creación debido a las dependencias

DROP TABLE IF EXISTS Order_Items;       -- Tabla hija de Orders y Products
DROP TABLE IF EXISTS Orders;            -- Tabla que depende de Users
DROP TABLE IF EXISTS Reviews;           -- Tabla hija de Users y Products
DROP TABLE IF EXISTS Users;             -- Tabla que depende de Roles
DROP TABLE IF EXISTS Roles;             -- Tabla sin dependencias
DROP TABLE IF EXISTS Product_Category;  -- Tabla hija de Products y Categories
DROP TABLE IF EXISTS Products;          -- Tabla que depende de Categories
DROP TABLE IF EXISTS Categories;        -- Tabla sin dependencias
