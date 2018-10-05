// Print the order summary to a new window.
function printOrderSummary(purchase, purchaseDetails, addresses, additionalInfo, fileStore, packingList) {

  var htmlHeader = '';
  var content = '<div class="header"><h2>';

  if (packingList === false)
  {
    content += 'Order Summary - ';
    htmlHeader = '<html><head><title>Order Summary</title>';
  }
  else
  {
    content += 'Packing List - ';
    htmlHeader = '<html><head><title>Packing List</title>';
  }

  content += purchase.get('id') + '</h2></div>' ;
  var disp_setting="toolbar=yes,location=no,directories=yes,menubar=yes,scrollbars=yes,width=800, height=600, left=100, top=25";

  if (packingList === false) {
    var orderInfo = ['Order Date:	', 'Order ID:	', 'P.O. Number:', 'Placed by: ', 'Shipping Method:	', 'Tracking Number: ', 'Lot Numbers: '];
    var orderInfoFields = ['purchase_date', 'id', 'po_number', 'username_display', 'shipping_method', 'tracking_number', 'lot_numbers' ];
  }
  else
  {
    var orderInfo = ['Order Date:	', 'Order ID:	', 'P.O. Number: ', 'Placed by: '];
    var orderInfoFields = ['purchase_date', 'id', 'po_number', 'username_display' ];

  }
  // top of page one
  content += '<table width="100%"><tr><td width="60%" valign="top">';
  content += '<ul class="address">';
  for (var i=0; i < orderInfo.length; i++)
  {
    content += '<li><strong>' + orderInfo[i] + '</strong> ';

    if ( orderInfoFields[i] === 'purchase_date') {
      content += Ext4.Date.format(purchase.get(orderInfoFields[i]) , 'm/d/Y H:i:s')
    }
    else
    {
      content += purchase.get(orderInfoFields[i])
    }
    content += '</li>';
  }
  content += '</ul>';
  content += '</td><td width="60%" align="right"><img width="200" src="/labkey/_webdav/CTRP_Admin/%40files/web/images/ag_logo_highres.png">';
  content += "</tr></table><br/>";

  // order summary table
  content += '<table width="100%" class="orderSummary"><tr>';
  content += '<td bgcolor="#cccccc" align="center"><strong>Product Name</strong></td>';
  content += '<td bgcolor="#cccccc" align="center"><strong>Price Per Unit</strong></td>';
  content += '<td bgcolor="#cccccc" align="center"><strong>Quantity Ordered</strong></td>';
  content += '<td bgcolor="#cccccc" align="center"><strong>Quantity Per Unit</strong></td>';
  content += '<td bgcolor="#cccccc" align="center"><strong>Total Product Cost</strong></td>';

  var totalPurchasePrice = 0;

  purchaseDetails.each(
    function(details)
    {

      var quantity = '';
      var quantityPerUnit = '';

      if (details.get('quantity_ordered') > 1)
      {
        quantity = details.get('unit');
      }
      else
      {
        quantity = details.get('unit_plural');
      }

      if (details.get('quantity_ordered') > 1)
      {
        quantityPerUnit = details.get('unit_base_plural');
      }
      else
      {
        quantityPerUnit = details.get('unit_base');
      }

      // product name
      content += '<tr><td>';
      content += details.get('name');
      content += '</td>';

      // price per unit
      content += '<td align="right">';
      content += Ext4.util.Format.currency(details.get('price_per_unit'), '$', '2' );
      content += '</td>';

      // quantity ordered
      content += '<td align="center">';

      content += details.get('quantity_ordered') + ' ';

      if (details.get('quantity_ordered') > 1) {
        content += details.get('unit_plural');
      }
      else
      {
        content += details.get('unit');
      }

      content += ' (' +  Ext4.util.Format.number(details.get('unit_count') * details.get('quantity_ordered'), '0,000') + ' ' + quantityPerUnit + ')';

      content += '</td><td align="center">';
      content += details.get('unit_count') + ' ' + quantityPerUnit;
      content += '</td><td align="right">';
      content += Ext4.util.Format.currency(details.get('subtotal'), '$', '2' );
      content += '</td></tr>';

      totalPurchasePrice += details.get('subtotal');
    });

  // totals
  content += '<tr><td colspan=3 class="borderless"></td><td bgcolor="#e2e2e2"><strong>Product Total</strong></td><td bgcolor="#e2e2e2" align="right">' + Ext4.util.Format.currency(totalPurchasePrice, '$', '2' );  + '</td></tr>';
  content += '<tr><td colspan=3 class="borderless"></td><td bgcolor="#e2e2e2"><strong>Shipping</strong></td><td bgcolor="#e2e2e2">Charges not Included</td></tr>';
  content += '<tr><td colspan=3 class="borderless"></td><td bgcolor="#e2e2e2"><strong>Balance Due</strong></td><td bgcolor="#e2e2e2" align="right">' + Ext4.util.Format.currency(totalPurchasePrice, '$', '2' );  + '</td></tr>';
  content+= '</table><br/>';

  // addresses.... NOTE: Users requested that billing address always appear first. So, fill the vars first and then put them in the table below.
  var shippingContent = '';
  var billingContent = '';

  addresses.each(
    function(address) {
      var completeAddress = address.get('address');
	  if(address.get('address2') != null && address.get('address2').length > 0){
		  completeAddress += '<br/>' + address.get('address2');
	  }

      if (address.get('addresstype') === 'shipping')
      {
        shippingContent += '<h3>Address: ' + Ext4.String.capitalize(address.get('addresstype')) + '</h3>';
        shippingContent += address.get('institution_string') + '<br/>';
        shippingContent += address.get('firstname') +  ' ' + address.get('lastname') + '<br/>';
		    shippingContent += completeAddress + '<br/>';
        shippingContent += address.get('city') + ', ' + address.get('state') + ' ' + address.get('zip') + '<br/>';
        shippingContent += address.get('country') + '<br/><br/>';
        shippingContent += address.get('email') + '<br/>';
        shippingContent += address.get('phone') + '<br/>';

      }
      else if (address.get('addresstype') === 'billing')
      {
        billingContent += '<h3>Address: ' + Ext4.String.capitalize(address.get('addresstype')) + '</h3>';
        billingContent += address.get('institution_string') + '<br/>';
        billingContent += address.get('firstname') +  ' ' + address.get('lastname') + '<br/>';
        billingContent += completeAddress + '<br/>';
        billingContent += address.get('city') + ', ' + address.get('state') + ' ' + address.get('zip') + '<br/>';
        billingContent += address.get('country') + '<br/><br/>';
        billingContent += address.get('email') + '<br/>';
        billingContent += address.get('phone') + '<br/>';
      }
    });

  content+= '<table width="100%"><tr><td id="billing">' + billingContent + '</td><td id="shipping">' + shippingContent + '</td></tr></table>';

  // shipping instructions
  if (purchase.get('shipping_instructions') != '')
  {
    content+= '<table width="100%"><tr><td>';
    content+= '<h3>Shipping Instructions</h3>';
    content += purchase.get('shipping_instructions');
    content+= '</td></tr></table><br/>';
  }


  if (packingList === false)
  {
    // files
    if (fileStore.count() > 0)
    {

      content += '<table width="100%"><tr><td><h3>Files</h3></td></tr>';
      content+= '<tr><td bgcolor="#cccccc" align="center" width="35%"><strong>File</strong></td><td bgcolor="#cccccc" align="center" width="15%"><strong>Category</strong></td><td bgcolor="#cccccc" align="center" width="50%"><strong>Description</strong></td><td></td></tr>';

      fileStore.each( function(rec)
{
          content += '<tr>';
          content += '<td>' + rec.data.file_name + '</td>';
          content += '<td>' + rec.data.category + '</td>';
          content += '<td>' + rec.data.description + '</td>';
          content += '</tr>';
      })

      content+= '</td></tr></table><br/>';

    }

    // additional information
    var questions = [];
    content+= '<table width="100%"><tr><td>';
    content+= '<h3>Additional Info</h3>';
var currentQuestionId = 0;
var currentDetailId = 0;
additionalInfo.each(function(rec){
  if(currentDetailId != rec.get('purchasedetail_id')){
    currentDetailId = rec.get('purchasedetail_id');
    var product = purchaseDetailsStore.find('ID', rec.get('purchasedetail_id'));
    if(product > -1){
      var pd = purchaseDetailsStore.getAt(product);
      content += '<h3>' + pd.get('name') +' (';
      if(pd.get('quantity_ordered') > 1){
        content += pd.get('unit_plural') + ')</h3>'
      }
      else{
        content += pd.get('unit') + ')</h3>'
      }
    }
  }



  if(rec.get('question_id') == currentQuestionId){
    content += rec.get('answer_text') + '<br />';
  }
  else{
    currentQuestionId = rec.get('question_id');
    content += '<br><strong>' + rec.get('question_text') +  '</strong> <br/>';
    content += rec.get('answer_text') + '<br />';
    }


});

    content+= '</td></tr></table><br/>';
  }

  // print to the window
  var docprint=window.open("","",disp_setting);
  docprint.document.open();
  docprint.document.write(htmlHeader);
  docprint.document.write('<link rel="stylesheet" type="text/css" href="/labkey/_webdav/CTRP_Admin/%40files/web/admin.css">');
  // docprint.document.write('</head><body onLoad="self.print()"><center>');
  docprint.document.write('</head><body"><div class="printerFriendly">');
  docprint.document.write(content);
  docprint.document.write('</div></body></html>');
  docprint.document.close();
  docprint.focus();
}
