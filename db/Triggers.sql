
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
