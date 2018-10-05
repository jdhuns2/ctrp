SELECT CAST(purchasedetail.ID AS INTEGER) AS ID,
purchasedetail.price_per_unit,
purchasedetail.subtotal,
purchasedetail.quantity_ordered,
CAST(purchasedetail.purchase_id AS INTEGER) AS purchase_id,
product.name,
offering.unit,
offering.unit_plural,
offering.unit_base,
offering.unit_base_plural,
offering.unit_count,
offering.unit_weight,
offering.unit_weight_measure
FROM purchasedetail
INNER JOIN offering ON offering.id = purchasedetail.offering_id
INNER JOIN product ON product.id = offering.product_id;
