SELECT CAST(purchase.id as Integer) as id,
--purchase.id,
purchase.internal_notes,
purchase.po_number,
purchase.reference_number,
purchase.tracking_number,
CAST (purchase.purchase_date as DATE) purchase_date,
purchase.shipped_date,
purchase.shipping_instructions,
purchase.shipping_method,
----purchase.status_id,
status.id as status_id,
status.description,
status.workflow_category,
purchase.authority,
purchase.institution_type,
purchase.username,
purchase.username_display,
purchase.email,
purchase.telephone,
purchase.institution,
purchase.terms_and_conditions,
purchase.lot_numbers,
newFiles.purchase_id as newFileFlag,
newFiles.total as newFileTotal,
address.country,
address.state,
purchase.shipping_address,
purchase.billing_address
FROM purchase
inner join status on status.id = purchase.status_id
left outer join 
( 
 select distinct purchase_id,
 count(id) as total
 from ctrpfile
 group by purchase_id
) as newFiles on newFiles.purchase_id = purchase.id
left outer join address on address.id = purchase.shipping_address
--left outer join address on address.purchase_id = purchase.id
-- where address.addresstype = 'shipping'
order by CAST(purchase.purchase_date as DATE) DESC;
