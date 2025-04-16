/*
    Base de datos para la tienda en línea Victor Store.
    Este script crea las tablas necesarias y establece las relaciones entre ellas.
    Se han realizado adaptaciones para SQL Server, como el uso de MONEY para precios y el manejo de tipos ENUM.
*/

-- Crear la base de datos y cambiar el contexto
CREATE DATABASE victor_store;
GO
USE victor_store;
GO

-- Tabla Categories
CREATE TABLE Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);
GO

-- Tabla Products
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    price MONEY NOT NULL,
    discount SMALLINT DEFAULT 0,
    rating REAL CONSTRAINT CK_Products_Rating CHECK (rating >= 0 AND rating <= 5) DEFAULT 5,
    features NVARCHAR(MAX),         -- Se sugiere almacenar texto JSON
    specifications NVARCHAR(MAX),   -- Se sugiere almacenar texto JSON
    images NVARCHAR(MAX),           -- En SQL Server no existen arreglos; se puede usar NVARCHAR(MAX) o modelar una relación aparte
    main_category_id INT NULL,
    CONSTRAINT FK_Products_Categories FOREIGN KEY (main_category_id)
        REFERENCES Categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
GO

-- Tabla Product_Category (tabla de relación muchos a muchos)
CREATE TABLE Product_Category (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT FK_Product_Category_Product FOREIGN KEY (product_id)
        REFERENCES Products(id),
    CONSTRAINT FK_Product_Category_Category FOREIGN KEY (category_id)
        REFERENCES Categories(id)
);
GO

-- En SQL Server no se crean tipos ENUM, por lo que se simula en la tabla Users mediante CHECK.
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    role VARCHAR(20) DEFAULT 'user',
    nick_name VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(20),
    middle_name VARCHAR(20),
    last_name VARCHAR(20),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',

    CONSTRAINT CHK_Users_Role CHECK (role IN ('admin', 'editor', 'user')),
    CONSTRAINT CHK_Users_Status CHECK (status IN ('not verified', 'active', 'inactive', 'banned'))
);
GO

-- Tabla Reviews  
-- Nota: Debido a que en SQL Server las columnas que forman parte de una clave primaria no pueden ser NULL,
-- se ha modificado la acción de eliminación de "ON DELETE SET NULL" a "ON DELETE CASCADE".
CREATE TABLE Reviews (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating SMALLINT CONSTRAINT CK_Reviews_Rating CHECK (rating >= 1 AND rating <= 5),
    comment NVARCHAR(MAX),
    PRIMARY KEY (user_id, product_id),
    CONSTRAINT FK_Reviews_Users FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT FK_Reviews_Products FOREIGN KEY (product_id)
        REFERENCES Products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
GO

-- Tabla Orders
-- Se simula el tipo ENUM order_status usando VARCHAR con restricción CHECK.
CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    total MONEY NOT NULL,
    status VARCHAR(20) DEFAULT 'not processed',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT CHK_Orders_Status CHECK (status IN ('not processed', 'pending', 'shipped', 'delivered', 'cancelled'))
);
GO

-- Tabla Order_Items (tabla de relación para pedidos)
CREATE TABLE Order_Items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity SMALLINT NOT NULL,
    PRIMARY KEY (order_id, product_id),
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (order_id)
        REFERENCES Orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (product_id)
        REFERENCES Products(id)
        ON DELETE NO ACTION    -- La acción RESTRICT en PostgreSQL se puede simular con NO ACTION
        ON UPDATE CASCADE
);
GO

-- Tabla para almacenar los códigos de verificación de usuarios
CREATE TABLE Verification_Codes (
    user_id INT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    expires_at DATETIME2 DEFAULT DATEADD(MINUTE, 15, GETDATE()),
    CONSTRAINT FK_VerificationCodes_Users FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
