Ext4.define('DateRangePicker.view.DateRangePanel',{
	extend: 'Ext4.panel.Panel',
	alias: 'widget.daterangepanel',

	initComponent: function(args){
		this.callParent(args);
		//creating the components in the init function allows them to be given
		//default values
		var startDateField = Ext4.create('Ext4.form.field.Date',{
			name: 'startDate',
			fieldLabel: 'Start Date',
			itemId:'startDateField',
			listeners:{
				change: function(t, oldValue, newValue){
					this.up('panel').fireEvent('StartDateChanged',oldValue,newValue);
				}
			},
			value:this.startDate
		});
		var endDateField = Ext4.create('Ext4.form.field.Date',{
			name: 'endDate',
			fieldLabel: 'End Date',
			itemId:'endDateField',
			listeners:{
				change: function(t, oldValue, newValue){
					this.up('panel').fireEvent('EndDateChanged',oldValue,newValue);
				}
			},
			value:this.endDate
		});
		this.add(startDateField);
		this.add(endDateField);
		this.fireEvent('StartDateChanged',this.startDate);
		this.fireEvent('EndDateChanged',this.endDate);
		//console.log('date range view init');
	}
});

Ext4.define('DateRangePicker.controller.DateRangeController',{
	extend: 'Ext4.app.Controller',
	views:['DateRangePanel'],
	refs:[{
		ref: 'dateRangePanel',
		selector: 'daterangepanel'
	}],
	init: function(){
		this.listen({
			global:{
					'RefireEvents':this.fireEvents
				},
			component:{
				'daterangepanel':{StartDateChanged:this.startDateChanged,
				EndDateChanged:this.endDateChanged}
			}
		});
		//console.log('date range controller init');
	},
	startDateChanged: function(newDate, oldDate){
		if(newDate !=null){
			this.fireEvent('StartDateChanged', newDate, oldDate);
		}
	},
	endDateChanged: function(newDate, oldDate){
		if(newDate !=null){
			this.fireEvent('EndDateChanged', newDate, oldDate);
		}
	},
	fireEvents:function(){
		//refire events with values. Used for on startup since events may not have been heard by all components
		this.fireEvent('StartDateChanged',this.getDateRangePanel().getComponent('startDateField').getValue())
		this.fireEvent('EndDateChanged', this.getDateRangePanel().getComponent('endDateField').getValue());
	}

});
