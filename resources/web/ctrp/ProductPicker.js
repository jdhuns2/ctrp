Ext4.define('ProductPicker.store.ProductStore',{
	extend: 'LABKEY.ext4.data.Store',
	schemaName: 'ctrp_admin',
	queryName: 'product',
	id: 'productStore',
});

Ext4.define('ProductPicker.store.CategoryStore',{
	extend: 'LABKEY.ext4.data.Store',
	schemaName: 'ctrp_admin',
	queryName: 'uniqueCategory',
	id: 'categoryStore',
});

Ext4.define('ProductPicker.view.ControlPanel', {
    extend: 'Ext4.panel.Panel',
	alias: 'widget.controlpanel',  //it seems this alias is critical for extjs to create the view correctly
	config:{
		useInventorySort:true
	},
	items:[{
			xtype: 'combobox',
			fieldLabel: 'Select a product category',
			valueField: 'category',
			displayField: 'category',
			itemId: 'categoryCombo',
			store:'CategoryStore',
			listeners:{
				'select':function(combobox){
					//apply filter to the product list
					this.up('panel').fireEvent('CategorySelected',combobox.getValue());
				}
			}
		},{
			xtype: 'combobox',
			fieldLabel: 'Select a product',
			valueField: 'id',//change this so that it can be customized on initialization
			displayField: 'name',
			itemId: 'productCombo',
			width: 300,
			store:'ProductStore',
			listeners:{
				'select':function(comboBox){
					this.up('panel').fireEvent('ProductSelected',comboBox);
				}
			}
		},{
			xtype:'button',
			text: 'Clear product filter',
			itemId: 'clearProductButton'
		}],
	initComponent: function(args){
		//have to include this in init function, it sets up the components in items
		this.callParent(args);
		//check for applyCategoryFilter config
		if(this.applyProficiencyFilter){
			this.getComponent('productCombo').getStore().filter(Ext4.create('Ext4.util.Filter',{
				filterFn: function(item){
					if(item.get('name').indexOf('Proficiency') > -1){
						return false;
					}
					return true;
				}
			}));
			this.getComponent('categoryCombo').getStore().filter(Ext4.create('Ext4.util.Filter',{
				filterFn: function(item){
					if(item.get('category') == 'Proficiency Studies' || item.get('category') == 'Previous Studies'){
						return false;
					}
					return true;
				}
			}));
		}

		if(this.categoryOnly){
			this.getComponent('productCombo').hide();
		}
		if(this.hideClearProductFilter){
			this.getComponent('clearProductButton').hide();
		}
	},
	/*onStoreLoad: function(t, records, successful, eops){
		if(t.inlineData == null && this.getUseInventorySort()){
			//this is product combo sort based on inventory_order column
			t.sort('inventory_order','ASC');
		}
		this.fireEvent('storeLoaded');
	}*/
});

Ext4.define('ProductPicker.controller.ControlPanel', {
    extend: 'Ext4.app.Controller',
	views:['ControlPanel'],
	stores:['ProductStore','CategoryStore'],
    refs:[
		{ref:'controlPanel',//this will generate a getControlPanel() function
		selector:'controlpanel'//same as the widget name
		}

	],
	init: function() {
		this.stores = 2;
		this.getCategoryStoreStore().addListener('load',this.storeLoaded,this);
		this.getProductStoreStore().addListener('load',this.storeLoaded,this);
		this.getCategoryStoreStore().load();
		this.getProductStoreStore().load();
		this.listen({
			global:{
					'RefireEvents':this.fireEvents
				},
			component:{//place multiple listeners in same object
				'controlpanel':{ProductSelected:this.productSelected,
				CategorySelected:this.applyCategoryFilter,
				storeLoaded:this.storeLoaded
				},
				'controlpanel button':{click:this.clearFilter},
			}
		});
    },
	storeLoaded: function(){
		this.stores = this.stores -1;
		if(this.stores==0){
			//pick default values for category and product
			this.getProductStoreStore().sort('inventory_order', 'ASC');
			var lastValue = Ext4.util.Cookies.get('productSelected');
			var rec = this.getProductStoreStore().findRecord('name',lastValue);
			if(rec == null){//fall back to defaultchoice
				lastValue = this.getControlPanel().defaultChoice;
			}
			rec = this.getProductStoreStore().findRecord('name',lastValue);

				if(rec != null){//possible that default choice is null
					var categoryCombo = this.getControlPanel().getComponent('categoryCombo');
					var productCombo = this.getControlPanel().getComponent('productCombo');
					//set the combo values based on config
					categoryCombo.setValue(this.getCategoryStoreStore().findRecord('category',rec.get('category')));
					categoryCombo.fireEvent('select',categoryCombo);

					productCombo.setValue(rec);
					productCombo.fireEvent('select', productCombo);
				}

			else{//no cookie value, no found record show all records
				this.clearFilter();
			}
		}
	},
	clearFilter:function(){
		this.getControlPanel().getComponent('productCombo').reset();
		this.getControlPanel().getComponent('categoryCombo').reset();
		this.getProductStoreStore().removeFilter()
		this.fireEvent('ProductFilterCleared');
		var expire = new Date(Date.now()+ 365 * 24 * 60 * 60 * 1000);
		this.setCookie('productSelected',null, expire);
	},
	productSelected:function(combobox){
		record = combobox.getStore().findRecord('id',combobox.getValue());
		if(record != null){
			this.setCookie('productSelected',record.get('name'), new Date(Date.now()+ 365 * 24 * 60 * 60 * 1000));
			this.fireEvent('ProductSelected', record);
		}
	},
	applyCategoryFilter:function(category){
		var productStore = this.getControlPanel().getComponent('productCombo').getStore();

		productStore.removeFilter("categoryFilter");
		productStore.filter(Ext4.create('Ext4.util.Filter',{
			id: 'categoryFilter',
			filterFn: function(item){
				if(item.get('category').indexOf(category) > -1){
					return true;
				}
				return false;
			}
		}));
		//select new product
		this.categorySelected(category);
		var productCombo = this.getControlPanel().getComponent('productCombo');
			productCombo.setValue(productCombo.getStore().getAt(0));
			productCombo.fireEvent('select',productCombo);
	},
	categorySelected:function(category){
		this.fireEvent('CategorySelected',category);
	},
	fireEvents:function(){
		this.productSelected(this.getControlPanel().getComponent('productCombo'));
	},
	setCookie:function(name, value){
        var argv = arguments,
            argc = arguments.length,
            expires = (argc > 2) ? argv[2] : null,
            path = (argc > 3) ? argv[3] : '/',
            domain = (argc > 4) ? argv[4] : null,
            secure = (argc > 5) ? argv[5] : false;

        document.cookie = name + "=" + escape(value) + ((expires === null) ? "" : ("; expires=" + expires.toUTCString())) + ((path === null) ? "" : ("; path=" + path)) + ((domain === null) ? "" : ("; domain=" + domain)) + ((secure === true) ? "; secure" : "");
    }
});
