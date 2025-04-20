
-- Trigger para eliminar filas relacionadas en Product_Category al eliminar una categoría
CREATE TRIGGER trg_AfterDeleteCategory
ON Categories
AFTER DELETE
AS
BEGIN
    -- Eliminar las filas relacionadas en Product_Category
    DELETE FROM Product_Category
    WHERE category_id IN (SELECT id FROM DELETED);
    
    -- Mensaje para confirmar la operación (en un entorno de desarrollo)
    PRINT 'Filas relacionadas eliminadas de Product_Category tras eliminar una categoría.';
END;
GO

-- Trigger para eliminar filas relacionadas en OrderItems al eliminar una orden
CREATE TRIGGER trg_AfterDeleteOrder
ON Orders
AFTER DELETE
AS
BEGIN
    -- Eliminar las filas relacionadas en OrderItems
    DELETE FROM OrderItems
    WHERE order_id IN (SELECT id FROM DELETED);
    
    -- Mensaje para confirmar la operación (en un entorno de desarrollo)
    PRINT 'Filas relacionadas eliminadas de OrderItems tras eliminar una orden.';
END;
GO

-- Trigger para eliminar filas relacionadas en OrderItems y en Reviews al eliminar un producto
CREATE TRIGGER trg_AfterDeleteProduct
ON Products
AFTER DELETE
AS
BEGIN
    -- Eliminar las filas relacionadas en OrderItems
    DELETE FROM OrderItems
    WHERE product_id IN (SELECT id FROM DELETED);

    -- Eliminar las filas relacionadas en Reviews
    DELETE FROM Reviews
    WHERE product_id IN (SELECT id FROM DELETED);
    
    -- Mensaje para confirmar la operación (en un entorno de desarrollo)
    PRINT 'Filas relacionadas eliminadas de OrderItems tras eliminar un producto.';
END;
GO



-- Consultar los triggers creados en la base de datos
SELECT name AS TriggerName,
    parent_class_desc AS TableOrView,
    type_desc AS TriggerType,
    is_disabled AS IsDisabled
FROM sys.triggers;
