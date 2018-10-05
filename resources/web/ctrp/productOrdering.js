<h1>Test page for product sorting</h1>

<p>An Administrative tool to help with the display order of the products and product categories on the web page.</p>
<p>To use:</p>
<ol><li>
Select an item by clicking a row in the table.</li>
<li>Move the item up with the '/\' button and down with the '\/' button.</li>
<li>Commit the changes to the site by clicking the Submit button</li></ol>

<p>Please note to make inserting new products easier the Product Display Order is sorted from largest to smallest.  So the product with the biggest number will be at the top of the category.</p>

<div id="categoryOrder"></div>
<div id="productSelection" style="margin:10px;"></div>
<div id="productOrder"></div>

<script type="text/javascript">

LABKEY.requiresScript('clientapi/ext4/Util.js');
LABKEY.requiresScript('clientapi/ext4/data/Reader.js');
LABKEY.requiresScript('clientapi/ext4/data/Proxy.js');
LABKEY.requiresScript('clientapi/ext4/data/Store.js');

Ext4.define('CategoryPanel', {
	extend: 'Ext4.grid.Panel',
    title: 'Product Category Display Order',
    columns: [
        { text: 'Category Name',  dataIndex: 'product_category', width:155 },
        { text: 'Order', dataIndex: 'category_order', flex: 1 }
    ],
    height: 200,
    width: 300,
	margin:10,
	listeners: {
		itemclick : {fn: function(t, record, item, index, e, e0pts){
							this.currentRecord = record;
							}},
	},

	bbar: [{
			xtype: 'button',
			text: ' /\\ ',
			handler: function(){
					//move category up
					var record = this.up('panel').currentRecord;
					if (record==null){
						alert('You must select a record first!');
						return;
					}
					
					if (record.getData().category_order == 1){
						//category cannot be moved up anymore
						return;
					}
					
					var s = this.up('panel').getStore();
					
					record.set('category_order',record.get('category_order')-1);
					s.each(function(r){
						if(r.getData().id !== record.getData().id && r.get('category_order') === record.get('category_order')){
							r.set('category_order', r.get('category_order') + 1);
						}
					});
					s.sort('category_order','AESC');
				}
			},{
				xtype: 'button',
				text: ' \\/ ',
				handler: function(){
					//move category down
					var record = this.up('panel').currentRecord;
					if (record==null){
						alert('You must select a record first!');
						return;
					}
					var s = this.up('panel').getStore();
					if (record.getData().category_order >= s.count()){
						//category cannot be moved down anymore
						return;
					}
					record.set('category_order',record.get('category_order')+1);
					s.each(function(r){
						if(r.getData().id !== record.getData().id && r.get('category_order') === record.get('category_order')){
							r.set('category_order', r.get('category_order') -1);
						}
					});
					s.sort('category_order','AESC');
				}
            },{
				xtype:'tbfill'
			},{
                xtype: 'button',
                text: 'Submit', 
                handler: function() {
					//save the changes to the database
					this.up('panel').getStore().commitChanges();
                }//end of submit button handle function
              }
            ]//end of bbar
	});

Ext4.define('ProductDisplayOrderPanel',{
		extend: 'Ext4.grid.Panel',
		title: 'Product Display Order',
		width: 605,
		columns: [
			{ text: 'Product',  dataIndex: 'name', width:350, hideable: false},
			{ text: 'Display Order', dataIndex: 'display_order', sortable: false},
			{text: 'Category', dataIndex: 'product_category', width:150, sortable: false}
		],
		
		height: 300,
		margin: 10,
		listeners: {
			itemclick : {fn: function(t, record, item, index, e, e0pts){
							this.currentRecord = record;
							}},
		},
		bbar: [{
				xtype: 'button',
				text: ' /\\ ',
				handler: function(){
					//move product up
					var record = this.up('panel').currentRecord;
					if (record==null){
						alert('You must select a record first!');
						return;
					}
					var s = this.up('panel').getStore();
					
					if (record.get('display_order') >= s.count()){
						//product cannot be moved up anymore
						return;
					}
					record.set('display_order',record.get('display_order')+1);
					s.each(function(r){
						if(r.get('id') !== record.get('id') && r.get('display_order') === record.get('display_order')){
							r.set('display_order', r.get('display_order') - 1);
						}
					});
					s.sort('display_order','DESC');
				}
			},{
				xtype: 'button',
				text: ' \\/ ',
				handler: function(){
					//move product down
					var record = this.up('panel').currentRecord;
					if (record==null){
						alert('You must select a record first!');
						return;
					}
					var s = this.up('panel').getStore();
					if (record.get('display_order') ==1){
						//category cannot be moved down anymore
						return;
					}
					record.set('display_order',record.get('display_order')-1);
					s.each(function(r){
						if(r.get('id') !== record.get('id') && r.get('display_order') === record.get('display_order')){
							r.set('display_order', r.get('display_order') +1);
						}
					});
					s.sort('display_order','DESC');
				}
            },{
				xtype:'tbfill'
			},{
				xtype: 'button',
                text: 'Submit', 
                handler: function() {
					//save the changes to the database
					//must make changes to the offeringdatastore to commit them first
					var s = this.up('panel').getStore();
					var offeringStore = this.up('panel').offeringStore;
					//loop through the s store (containing the view) and make the changes to the offeringStore which can be updated
					
					for(i=0; i<s.count(); i++){
						var r = s.getAt(i);
						for (j=0; j<offeringStore.count(); j++){
							var r2 = offeringStore.getAt(j);
							if(r.get('id') == r2.get('id')){
								r2.set('display_order',r.get('display_order'));
								j = offeringStore.count();//leave loop early
							}
						}//end for j
					}//end for i
					offeringStore.commitChanges();
					
                }//end of submit button handle function
              }
            ]//end of bbar
	});
	
Ext4.onReady(function(){
	
	
	var categoryStore = Ext4.create('LABKEY.ext4.data.Store',{
		schemaName: 'ctrp',
		containerPath: '/query/jdh',
		queryName: 'product_category',
		autoload: true,
	});
	categoryStore.load();
	
	//This offering store is used to save the changes made since the offeringDataStore is a view that cannot be modified.
	var offeringStore = Ext4.create('LABKEY.ext4.data.Store',{
		schemaName: 'ctrp',
		containerPath: '/query/jdh',
		queryName: 'offeringOrder',
	});
	//set initial filter and category
	offeringStore.load();
	offeringStore.filter('product_category', 'Proficiency Studies');
	offeringStore.sort('display_order', 'DESC');
	
	var offeringDataStore = Ext4.create('LABKEY.ext4.data.Store',{
		schemaName: 'ctrp',
		containerPath: '/query/jdh',
		queryName: 'offering',
	});
	offeringDataStore.load();
	
	
	var categoryPanel = Ext4.create('CategoryPanel',{
		store: categoryStore,
		renderTo:'categoryOrder'
	});
	
	var cb = Ext4.create('Ext4.form.ComboBox',{
		fieldLabel: 'Select Product Category',
		store: categoryStore,
		displayField: 'product_category',
		valueField: 'id',
		renderTo: 'productSelection',
		listeners:{
         scope: this,
         'select': function(combo, records, e0pts){
			 offeringStore.removeFilter();
			 offeringStore.filter('product_category', records[0].get('product_category'));
			 offeringStore.sort('display_order','DESC');
			}
		},
	});
	cb.setValue('Proficiency Studies');
	
	var productPanel = Ext4.create('ProductDisplayOrderPanel',{
		store: offeringStore,
		offeringStore: offeringDataStore,
		renderTo: 'productOrder',
	});
});
</script>