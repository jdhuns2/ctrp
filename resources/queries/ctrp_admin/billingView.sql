SELECT 
billing.id,
billing.purchase_id,
billing.purchasedetail_id,
CASE 
  When billing.purchasedetail_id is null then bt.billing
  Else p.name
end as transaction_detail,
billing.amount * bt.debitcredit as amount,
--CAST (billing.payment_date AS VARCHAR ) as payment_date,
billing.payment_date,
billing.check_number,
billing.comments,
--billing.created,
--billing.modified,
bt.id as billingtypeid,
bt.description
FROM billing
inner join billingtype bt on bt.id = billing.billingtype_id
left outer join purchasedetail pd on pd.id = billing.purchasedetail_id
left outer join offering o on o.id = pd.offering_id
left outer join product p on p.id = o.product_id

-- Had to format payment_date as String because of weird JSON error... bd
