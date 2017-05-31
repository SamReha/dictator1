var ContractClipboard={
	createNew: function(cbInfo){
		var contract = game.make.group();

		contract.page = Page.createNew();
		contract.page.anchor.setTo(.5,.5);
		contract.addChild(contract.page);

		contract.contract = PeopleContractView.createNew(cbInfo.personDataRef);
		contract.contract.anchor.setTo(.5,.5);
		contract.addChild(contract.contract);
		
		return contract;
	},
};