PARAMETERS(
purchaseId INTEGER
)

SELECT purchaseDetailsView.ID,
purchaseDetailsView.price_per_unit,
purchaseDetailsView.subtotal,
purchaseDetailsView.quantity_ordered,
purchaseDetailsView.purchase_id,
purchaseDetailsView.name,
purchaseDetailsView.unit,
purchaseDetailsView.unit_plural,
purchaseDetailsView.unit_base,
purchaseDetailsView.unit_base_plural,
purchaseDetailsView.unit_count,
purchaseDetailsView.unit_weight,
purchaseDetailsView.unit_weight_measure
FROM purchaseDetailsView where purchase_id = purchaseId;
