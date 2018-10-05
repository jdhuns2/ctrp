PARAMETERS(
purchaseId INTEGER
)

SELECT billingView.id,
billingView.purchase_id,
billingView.purchasedetail_id,
billingView.transaction_detail,
billingView.amount,
billingView.payment_date,
billingView.check_number,
billingView.comments,
billingView.billingtypeid,
billingView.description
FROM billingView where billingView.purchase_id = purchaseId;
