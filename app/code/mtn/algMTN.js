include('code/common/workNetlist.js');
include('code/common/outPrintMTN.js');




/****************************************Encapsulted Functions****************************************/


/**
 * Count Nodes By Type (0 = Real, 1 - Virtual)
 * @param {Array} objArr Array of Nodes objects
 * @param {Int} type Desired type of node to return
 * @returns Number of Nodes
 */
function countNodesByType(objArr, type) {
	let cnt = 0;
	for(let i=0; i<objArr.length; i++) { if(objArr[i].type == type) cnt++;}
	return cnt;
}

/**
 * MTN Algorythm Implementation
 */
function loadFileAsTextMTN(data) {
	document.getElementById('print').disabled = true;
	let jsonFile = JSON.parse(data);
	console.log('loadFileAsTextMTN', jsonFile)

	branches = jsonFile.branches;
	nodes = jsonFile.nodes;
	components = jsonFile.components;
	simInfo = jsonFile.analysisObj;
	isolatedPS = jsonFile.isolatedPS;


	// Math namespaces/prototypes
	var Fraction = algebra.Fraction;
	var Expression = algebra.Expression;
	var Equation = algebra.Equation;

	// Create arrays to store objects data
	var resistors = jsonFile.components.resistors;
	var coils = jsonFile.components.coils;
	var capacitors = jsonFile.components.capacitors;
	var dcVoltPs = jsonFile.components.dcVoltPs;
	var acVoltPs = jsonFile.components.acVoltPs;
	var dcAmpsPs =jsonFile.components.dcAmpsPs;
	var acAmpsPs = jsonFile.components.acAmpsPs;
	var ampsMeters = new Array();
	var voltMeters = new Array();



	var currents = jsonFile.analysisObj.currents;
	var supernodes = new Array();
	var connections = new Array();


// //Copy data to ameters object
// 	let ammetersTemp=new Array();
// 	for(let i=0; i<components.ammeters.length; i++){
// 		let ammeterNew=new ammeter(components.ammeters[i].id, components.ammeters[i].ref, components.ammeters[i].noP, components.ammeters[i].noN, components.ammeters[i].type, components.ammeters[i].value, components.ammeters[i].unitMult, components.ammeters[i].intRes, components.ammeters[i].intResMult, components.ammeters[i].current, components.ammeters[i].posX, components.ammeters[i].posY, components.ammeters[i].globalNoP, components.ammeters[i].globalNoN);
// 		ammetersTemp.push(ammeterNew);
// 	}
	let dcAmpNTemp=new Array();
	let dcVoltNTemp=new Array();
for(let j=0; j<nodes.length; j++){
	for(let i=0; i<nodes[j].branches.length; i++){
		dcVoltNTemp=[];
		dcAmpNTemp=[];
		let currentsNTemp=new Array();
		let ammetersNTemp=new Array();
		let resistorsBTemp= new Array();
		let currentNNew=new current(nodes[j].branches[i].currentData.id, nodes[j].branches[i].currentData.ref, nodes[j].branches[i].currentData.noP, nodes[j].branches[i].currentData.noN, nodes[j].branches[i].currentData.type, null, nodes[j].branches[i].currentData.voltage, nodes[j].branches[i].currentData.value, nodes[j].branches[i].currentData.ohmEquation, nodes[j].branches[i].currentData.fixed, nodes[j].branches[i].currentData.nodeEquations);
		currentsNTemp.push(currentNNew);
		nodes[j].branches[i].currentData=currentsNTemp[0];
		if(nodes[j].branches[i].ammeters!==undefined){
		let ammeterNNew=new ammeter(nodes[j].branches[i].ammeters.id, nodes[j].branches[i].ammeters.ref, nodes[j].branches[i].ammeters.noP, nodes[j].branches[i].ammeters.noN, nodes[j].branches[i].ammeters.type, nodes[j].branches[i].ammeters.intRes, nodes[j].branches[i].ammeters.intResMult, nodes[j].branches[i].ammeters.posX, nodes[j].branches[i].ammeters.posY);
		ammetersNTemp.push(ammeterNNew);
		nodes[j].branches[i].ammeters=ammetersNTemp;}
		if(nodes[j].branches[i].resistors.length>0){
		for(let k=0; k<nodes[j].branches[i].resistors.length; k++){
		let resistorBNew= new resistor(nodes[j].branches[i].resistors[k].id, nodes[j].branches[i].resistors[k].ref, nodes[j].branches[i].resistors[k].noP, nodes[j].branches[i].resistors[k].noN, nodes[j].branches[i].resistors[k].type, nodes[j].branches[i].resistors[k].value, nodes[j].branches[i].resistors[k].unitMult, nodes[j].branches[i].resistors[k].temp, nodes[j].branches[i].resistors[k].posX, nodes[j].branches[i].resistors[k].posY);
		resistorsBTemp.push(resistorBNew);}
		nodes[j].branches[i].resistors=resistorsBTemp;}
		if(nodes[j].branches[i].dcAmpPwSupplies.length>0){
		for(let k=0; k<nodes[j].branches[i].dcAmpPwSupplies.length; k++){

			let dcAmpPwSuppliesNTemp=new dcCurrPower(nodes[j].branches[i].dcAmpPwSupplies[k].id, nodes[j].branches[i].dcAmpPwSupplies[k].ref,nodes[j].branches[i].dcAmpPwSupplies[k].noP, nodes[j].branches[i].dcAmpPwSupplies[k].noN, nodes[j].branches[i].dcAmpPwSupplies[k].type, nodes[j].branches[i].dcAmpPwSupplies[k].value, nodes[j].branches[i].dcAmpPwSupplies[k].unitMult, nodes[j].branches[i].dcAmpPwSupplies[k].intRes, nodes[j].branches[i].dcAmpPwSupplies[k].intResMult, nodes[j].branches[i].dcAmpPwSupplies[k].current, nodes[j].branches[i].dcAmpPwSupplies[k].posX, nodes[j].branches[i].dcAmpPwSupplies[k].posY, nodes[j].branches[i].dcAmpPwSupplies[k].globalNoP, nodes[j].branches[i].dcAmpPwSupplies[k].globalNoN);
			dcAmpNTemp.push(dcAmpPwSuppliesNTemp)}
		nodes[j].branches[i].dcAmpPwSupplies=dcAmpNTemp;}
		if(nodes[j].branches[i].dcVoltPwSupplies.length>0){
		for(let k=0; k<nodes[j].branches[i].dcVoltPwSupplies.length; k++){

			let dcVoltPwSuppliesNTemp=new dcVoltPower(nodes[j].branches[i].dcVoltPwSupplies[k].id, nodes[j].branches[i].dcVoltPwSupplies[k].ref,nodes[j].branches[i].dcVoltPwSupplies[k].noP, nodes[j].branches[i].dcVoltPwSupplies[k].noN, nodes[j].branches[i].dcVoltPwSupplies[k].type, nodes[j].branches[i].dcVoltPwSupplies[k].value, nodes[j].branches[i].dcVoltPwSupplies[k].unitMult, nodes[j].branches[i].dcVoltPwSupplies[k].intRes, nodes[j].branches[i].dcVoltPwSupplies[k].intResMult, nodes[j].branches[i].dcVoltPwSupplies[k].voltage, nodes[j].branches[i].dcVoltPwSupplies[k].posX, nodes[j].branches[i].dcVoltPwSupplies[k].posY);
			dcVoltNTemp.push(dcVoltPwSuppliesNTemp)}
		nodes[j].branches[i].dcVoltPwSupplies=dcVoltNTemp;}
	}}




for(let i=0; i<branches.length; i++){
	let currentsTemp=new Array();
		let currentNew=new current(branches[i].currentData.id, branches[i].currentData.ref, branches[i].currentData.noP, branches[i].currentData.noN, branches[i].currentData.type, null, branches[i].currentData.voltage, branches[i].currentData.value, branches[i].currentData.ohmEquation, branches[i].currentData.fixed, branches[i].currentData.nodeEquations);
		currentsTemp.push(currentNew);
		branches[i].currentData=currentsTemp[0];

	}

	for(let i=0; i<branches.length; i++){
		if(branches[i].ammeters){
		let ammetersTemp=new Array();
let ammeterNew=new ammeter(branches[i].ammeters.id, branches[i].ammeters.ref, branches[i].ammeters.noP, branches[i].ammeters.noN, branches[i].ammeters.type, branches[i].ammeters.intRes, branches[i].ammeters.intResMult, branches[i].ammeters.posX, branches[i].ammeters.posY);
ammetersTemp.push(ammeterNew);
branches[i].ammeters=ammetersTemp;}
	}

	//Copy data to resistor object
	for(let i=0; i<branches.length; i++){
		if(branches[i].resistors.length>0){
	let resistorsBTemp= new Array();
	for(let j=0; j<branches[i].resistors.length; j++){
		let resistorBNew= new resistor(branches[i].resistors[j].id, branches[i].resistors[j].ref, branches[i].resistors[j].noP, branches[i].resistors[j].noN, branches[i].resistors[j].type, branches[i].resistors[j].value, branches[i].resistors[j].unitMult, branches[i].resistors[j].temp, branches[i].resistors[j].posX, branches[i].resistors[j].posY);
		resistorsBTemp.push(resistorBNew);
	}
	branches[i].resistors=resistorsBTemp;}}


//Copy data to current object
	let currentsTemp= new Array();
	for(let i=0; i<currents.length; i++){
		let currentNew= new current(currents[i].id, currents[i].ref, currents[i].noP, currents[i].noN, currents[i].type, null, null, currents[i].value, currents[i].equation, currents[i].fixed, currents[i].nodeEquations);
		currentsTemp.push(currentNew);

	}
	currents=currentsTemp;

	let dcAmpTemp=new Array();
	for(let i=0; i<branches.length; i++){
		dcAmpTemp=[];
		if(branches[i].dcAmpPwSupplies.length>0){
		for(let j=0; j<branches[i].dcAmpPwSupplies.length; j++){
			let dcAmpPwSuppliesTemp=new dcCurrPower(branches[i].dcAmpPwSupplies[j].id, branches[i].dcAmpPwSupplies[j].ref, branches[i].dcAmpPwSupplies[j].noP, branches[i].dcAmpPwSupplies[j].noN, branches[i].dcAmpPwSupplies[j].type, branches[i].dcAmpPwSupplies[j].value, branches[i].dcAmpPwSupplies[j].unitMult, branches[i].dcAmpPwSupplies[j].intRes, branches[i].dcAmpPwSupplies[j].intResMult, branches[i].dcAmpPwSupplies[j].current, branches[i].dcAmpPwSupplies[j].posX, branches[i].dcAmpPwSupplies[j].posY, branches[i].dcAmpPwSupplies[j].globalNoP, branches[i].dcAmpPwSupplies[j].globalNoN);
			dcAmpTemp.push(dcAmpPwSuppliesTemp)}
		branches[i].dcAmpPwSupplies=dcAmpTemp;}}

	let dcVoltTemp=new Array();
	for(let i=0; i<branches.length; i++){
		if(branches[i].dcVoltPwSupplies.length>0){
		dcVoltTemp=[];
		for(let j=0; j<branches[i].dcVoltPwSupplies.length; j++){

			let dcVoltPwSuppliesTemp=new dcVoltPower(branches[i].dcVoltPwSupplies[j].id, branches[i].dcVoltPwSupplies[j].ref, branches[i].dcVoltPwSupplies[j].noP, branches[i].dcVoltPwSupplies[j].noN, branches[i].dcVoltPwSupplies[j].type, branches[i].dcVoltPwSupplies[j].value, branches[i].dcVoltPwSupplies[j].unitMult, branches[i].dcVoltPwSupplies[j].intRes, branches[i].dcVoltPwSupplies[j].intResMult, branches[i].dcVoltPwSupplies[j].voltage, branches[i].dcVoltPwSupplies[j].posX, branches[i].dcVoltPwSupplies[j].posY);
			dcVoltTemp.push(dcVoltPwSuppliesTemp);}
		branches[i].dcVoltPwSupplies=dcVoltTemp;}}

	//Copy data to branch object
	let branchesTemp=new Array();
	for(let i=0; i<branches.length; i++){
		let branchNew=new branch(branches[i].id, branches[i].ref, branches[i].startNode,
			branches[i].endNode,  branches[i].currentId,  branches[i].dcVoltPwSupplies,
			branches[i].acVoltPwSupplies,  branches[i].dcAmpPwSupplies,  branches[i].acAmpPwSupplies,
			branches[i].resistors,  branches[i].coils,  branches[i].capacitors,
			branches[i].ammeters,  branches[i].equivImpedance,  branches[i].equivVoltPs,
			branches[i].endVoltPsEndNodes,  branches[i].currentData )
		branchesTemp.push(branchNew);}
	branches=branchesTemp;



	//Copy data to node object
	let nodesTemp= new Array();
	for(let i=0; i<nodes.length; i++){
		let branchesNodeTemp=new Array();
		for(let j=0;j<nodes[i].branches.length;j++){
			branches.forEach(element=>{if(element.id===nodes[i].branches[j].id){branchesNodeTemp.push(element)}});}
		let nodeNew=new node(nodes[i].id, nodes[i].ref, branchesNodeTemp, nodes[i].type, nodes[i].voltage);
		nodesTemp.push(nodeNew);
	}
	nodes=nodesTemp;

	//Copy data to coil object
	let coilsTemp=new Array();
	for(let i=0; i<coils.length; i++){
		let coilNew=new coil(coils[i].id, coils[i].ref, coils[i].noP, coils[i].noN, coils[i].type, coils[i].values, coils[i].unitMult, coils[i].initValue, coils[i].impedance, coils[i].posX, coils[i].posY);
		coilsTemp.push(coilNew);
	}
	coils=coilsTemp;

	//Copy data to resistor object
	let resistorsTemp= new Array();
	for(let i=0; i<resistors.length; i++){
		let resistorNew= new resistor(resistors[i].id, resistors[i].ref, resistors[i].noP, resistors[i].noN, resistors[i].type, resistors[i].value, resistors[i].unitMult, resistors[i].temp, resistors[i].posX, resistors[i].posY);
		resistorsTemp.push(resistorNew);
	}
	resistors=resistorsTemp;

	//Copy data to capacitor object
	let capacitorsTemp=new Array();
	for(let i=0; i<capacitors.length; i++){
		let capacitorNew=new capacitor(capacitors[i].id, capacitors[i].ref, capacitors[i].noP, capacitors[i].noN, capacitors[i].type, capacitors[i].value, capacitors[i].unitMult, capacitors[i].initValue, capacitors[i].impedance, capacitors[i].posX, capacitors[i].posY);
		capacitorsTemp.push(capacitorNew);
	}
	capacitors=capacitorsTemp;

	//Copy data to dcVoltPower object
	let dcVoltPsTemp=new Array();
	for(let i=0; i<dcVoltPs.length; i++){
		let dcVoltPsNew = new dcVoltPower(dcVoltPs[i].id, dcVoltPs[i].ref, dcVoltPs[i].noP, dcVoltPs[i].noN, dcVoltPs[i].type, dcVoltPs[i].value, dcVoltPs[i].unitMult, dcVoltPs[i].intRes, dcVoltPs[i].intResMult, dcVoltPs[i].voltage,  dcVoltPs[i].posX,  dcVoltPs[i].posY);
		dcVoltPsTemp.push(dcVoltPsNew);
	}
	dcVoltPs=dcVoltPsTemp;

//Copy data to acVoltPower object
	let acVoltPsTemp=new Array();
	for(let i=0; i<acVoltPs.length; i++){
		let acVoltPsNew=new acVoltPower(acVoltPs[i].id, acVoltPs[i].ref, acVoltPs[i].noP, acVoltPs[i].noN,acVoltPs[i].type, acVoltPs[i].value, acVoltPs[i].unitMult, acVoltPs[i].intRes, acVoltPs[i].intResMult,acVoltPs[i].freq, acVoltPs[i].freqMult,acVoltPs[i].phase,acVoltPs[i].theta, acVoltPs[i].voltage, acVoltPs[i].posX, acVoltPs[i].posY);
		acVoltPsTemp.push(acVoltPsNew);
	}
	acVoltPs=acVoltPsTemp;


//Copy data to dcCurrPower object
	let dcAmpsPsTemp=new Array();
	for(let i=0; i<dcAmpsPs.length;i++){
		let dcAmpsPsNew=new dcCurrPower(dcAmpsPs[i].id, dcAmpsPs[i].ref, dcAmpsPs[i].noP, dcAmpsPs[i].noN, dcAmpsPs[i].type, dcAmpsPs[i].value, dcAmpsPs[i].unitMult, dcAmpsPs[i].intRes, dcAmpsPs[i].intResMult, dcAmpsPs[i].current, dcAmpsPs[i].posX, dcAmpsPs[i].posY, dcAmpsPs[i].globalNoP, dcAmpsPs[i].globalNoN);
		dcAmpsPsTemp.push(dcAmpsPsNew);
	}
	dcAmpsPs=dcAmpsPsTemp;


//Copy data to acCurrPower object
	let acAmpsPsTemp=new Array();
	for(let i=0; i<acAmpsPs.length;i++){
		let acAmpsPsNew=new acCurrPower(acAmpsPs[i].id, acAmpsPs[i].ref, acAmpsPs[i].noP ,acAmpsPs[i].noN, acAmpsPs[i].type, acAmpsPs[i].value, acAmpsPs[i].unitMult, acAmpsPs[i].intRes, acAmpsPs[i].intResMult, acAmpsPs[i].freq, acAmpsPs[i].freqMult,acAmpsPs[i].phase,acAmpsPs[i].theta,acAmpsPs[i].current, acAmpsPs[i].posX, acAmpsPs[i].posY, null, null);
		acAmpsPsTemp.push(acAmpsPsNew);
	}
	acAmpsPs=acAmpsPsTemp;



	// Validate submitted Netlist File
	var netlistTxt = validateNetlist(fileContents[1]);
	if(fileContents[2])
		netlistTxt.first.push(fileContents[2]);
	if(fileContents[2])
		netlistTxt.first.splice(netlistTxt.first.length-1);


	console.debug('dcVoltPs', dcVoltPs)
	console.debug('acVoltPs', acVoltPs)


	// Search for SuperNodes
	// Grounded
	// If isolated voltage supplies have common nodes, they will constitute a Grounded Supernode
	// Floating
	// If in the nodes of an Isolated Power Supply there are no other isolated Power Supply, we are in the presence of a Floating Supernode

	// Save a copy of the Isolated Voltage PS array
	var isolatedPsReg = JSON.parse(JSON.stringify(isolatedPS));
	end = false;
	nextNode = '';
	let superNodeIndex = 0;
	let superNodeType = 0;	// In Predata Array, type 1 means that needs verification
	let supernodeCnt = 0;
	let rootNodeBoss = -1;
	let superNodesPreData = new Array();
	let mState = 1;	// State 1 - Searching for GND; State 2 - Following Nodes until reaches endNode
	do {
		switch (mState) {
			case 1: {
				for(let i=0; i<isolatedPS.length; i++) {
					let iVoltNoP = isolatedPS[i].noP;
					let iVoltNoN = isolatedPS[i].noN;
					let psVoltNode;
					let index;

					if( iVoltNoP === 'gnd' || iVoltNoN === 'gnd') {

						// Generate data for new Super Node
						let superNodeId = ++supernodeCnt;
						let superNodeRef = 'SNg' + supernodeCnt;
						let actualNode;

						if( iVoltNoP === 'gnd') actualNode = iVoltNoP;
						if( iVoltNoN === 'gnd') actualNode = iVoltNoN;

						// Gnd Node Index
						index = nodes.findIndex(item => item.ref === actualNode);
						if(index > -1) { psVoltNode = index; }

						superNodesPreData.push({sNodeId: superNodeId, sNodeRef: superNodeRef, sNodeType: superNodeType, sNodesRef: [nodes[psVoltNode].ref]});
						superNodeIndex = superNodesPreData.length-1;

						if( iVoltNoP === 'gnd') nextNode = iVoltNoN;
						if( iVoltNoN === 'gnd') nextNode = iVoltNoP;

						// Find Node Index
						index = nodes.findIndex(item => item.ref === nextNode);
						if(index > -1) { superNodesPreData[superNodeIndex].sNodesRef.push(nodes[index].ref); } // Save this Node

						// Remove entry from array
						isolatedPS.splice(i, 1);
						rootNodeBoss = -1;
						break;
					}
					else rootNodeBoss = 1;
				}
				// Change States Machine to 2nd Step
				mState++;
				break;
			}
			case 2: {
				if(isolatedPS.length === 0) end = true; // Exit States Machine
				for(let i=0; i<isolatedPS.length; i++) {
					let iVoltNoP = isolatedPS[i].noP;
					let iVoltNoN = isolatedPS[i].noN;
					let index;

					// If there are no more isolated voltage supplies connected to the nodes, all Super Node Voltage PS were found.
					if(nextNode === isolatedPS[i].noP || nextNode === isolatedPS[i].noN) {

						if( nextNode === isolatedPS[i].noP) nextNode = iVoltNoN;
						else if( nextNode === isolatedPS[i].noN) nextNode = iVoltNoP;

						// Find Node Index
						index = nodes.findIndex(item => item.ref === nextNode);
						if(index > -1) {
							if(index > -1) { superNodesPreData[superNodeIndex].sNodesRef.push(nodes[index].ref); } // Save this Node
						}

						// Remove entry from array
						isolatedPS.splice(i, 1);

						if(isolatedPS.length === 0) end = true; // Exit States Machine

						rootNodeBoss--;
						// Force cycle restart
						i = -1;
					}
				}
				// Go back to 1st Step
				if(rootNodeBoss > 0) mState = 3;
				else mState = 1;
				break;
			}
			case 3: {
				let index;
				let index2;
				if(isolatedPS.length === 0) {
					end = true; // Exit States Machine
					break;
				}

				index = isolatedPS.findIndex(item => item.noP === 'gnd');
				index2 = isolatedPS.findIndex(item => item.noN === 'gnd');
				if( (index < 0) && (index2 < 0) ) {

					// Start with the first element of the array
					let iVoltNoP = isolatedPS[0].noP;
					let iVoltNoN = isolatedPS[0].noN;

					// Generate data for new Super Node
					let superNodeId = ++supernodeCnt;
					let superNodeRef = 'SNf' + supernodeCnt;
					superNodeType = 1;

					// Gnd Node Index
					index = nodes.findIndex(item => item.ref === iVoltNoP);
					if(index > -1) {

						psVoltNode = index;

						superNodesPreData.push({sNodeId: superNodeId, sNodeRef: superNodeRef, sNodeType: superNodeType, sNodesRef: [nodes[psVoltNode].ref]});
						//superNodeIndex = supernodes.length-1;
						superNodeIndex = superNodesPreData.length-1;

						nextNode = iVoltNoN;

						// Find Node Index
						index = nodes.findIndex(item => item.ref === nextNode);
						if(index > -1) { superNodesPreData[superNodeIndex].sNodesRef.push(nodes[index].ref); } // Save this Node

						// Remove entry from array
						isolatedPS.splice(0, 1);
						rootNodeBoss = 1;
					}
					// Change States Machine to 2nd Step
					mState = 2;
					break;
				}
				else end = true; // Exit States Machine
			}
			default: {
				if(isolatedPS.length === 0) end = true; // Exit States Machine
				else mState = 3; // Go to state 3

				break;
			}
		}

	} while (!end);

	var superNodesPreDataReg = JSON.parse(JSON.stringify(superNodesPreData));

	end = false;
	do {
		// Insert Grounded Super Nodes, if exists
		let sNodesUniqueRef;
		let tempSuperNodesArr = new Array();
		for(let i=0; i<superNodesPreData.length; i++) {
			if(superNodesPreData[i].sNodeType === 0) {
				for(let j=0; j<superNodesPreData[i].sNodesRef.length; j++) {
					tempSuperNodesArr.push(superNodesPreData[i].sNodesRef[j]);
				}
			}
		}

		if(tempSuperNodesArr.length) {
			// Remove duplicated nodes references
			sNodesUniqueRef = [...new Set(tempSuperNodesArr)];

			// Generate data for new Super Node
			let superNodeId = ++circuitAnalCnt.gsupernode;
			let superNodeRef = 'SNg' + circuitAnalCnt.gsupernode;
			let superNodeType = 0;
			let thisSuperNode = new supernode(superNodeId, superNodeRef, superNodeType, []);
			supernodes.push(thisSuperNode);
			let superNodeIndex = supernodes.length-1;
			for(let i=0; i<sNodesUniqueRef.length; i++) {
				// Find Node Index
				index = nodes.findIndex(item => item.ref === sNodesUniqueRef[i]);
				if(index > -1) { supernodes[superNodeIndex].nodes.push(nodes[index]); }
			}
		}


		// Clean All Elements in the Array that constains a Grounded Node
		for(let i=0; i<tempSuperNodesArr.length; i++) {
			for(let j=0; j<superNodesPreData.length; j++) {
				if(superNodesPreData[j].sNodesRef.includes(tempSuperNodesArr[i])) {
					superNodesPreData.splice(j, 1);
					j--;
				}
			}
		}

		// Insert Floating Super Nodes, if exists
		if(superNodesPreData.length > 1) {
			// Merge Nodes that are connected each other
			let hasNodes = true;
			let snState = 1;
			let tempFloatingNodesArr = [];
			let iterNodesArr;
			do {
				switch (snState) {
					// Get Node to Search
					case 1: {
						if(superNodesPreData.length === 0) { hasNodes = false; break; }
						iterNodesArr = JSON.parse(JSON.stringify(superNodesPreData[0].sNodesRef));
						superNodesPreData.splice(0, 1);

						snState++;
						break;
					}
					case 2: {
						tempFloatingNodesArr = [];
						tempFloatingNodesArr = iterNodesArr;
						let foundId = false;
						for(let i=0; i<iterNodesArr.length; i++) {
							for(let j=0; j<superNodesPreData.length; j++) {
								if(superNodesPreData[j].sNodesRef.includes(iterNodesArr[i])) {
									//tempFloatingNodesArr = [];
									tempFloatingNodesArr = tempFloatingNodesArr.concat(superNodesPreData[j].sNodesRef.concat(iterNodesArr));
									superNodesPreData.splice(j, 1);
									// Remove duplicated
									tempFloatingNodesArr = [...new Set(tempFloatingNodesArr)];
									iterNodesArr = tempFloatingNodesArr;
									foundId = true;
									j--;
									//break;
								}
							}
							//if(foundId) break;
						}
						if(tempFloatingNodesArr.length) {
							// Remove duplicated nodes references
							let sNodesUniqueRef = [...new Set(tempFloatingNodesArr)];

							// Generate data for new Super Node
							let superNodeId = ++circuitAnalCnt.fsupernode;
							let superNodeRef = 'SNf' + circuitAnalCnt.fsupernode;
							let superNodeType = 1;
							let thisSuperNode = new supernode(superNodeId, superNodeRef, superNodeType, []);
							supernodes.push(thisSuperNode);
							let superNodeIndex = supernodes.length-1;
							for(let i=0; i<sNodesUniqueRef.length; i++) {
								// Find Node Index
								index = nodes.findIndex(item => item.ref === sNodesUniqueRef[i]);
								if(index > -1) { supernodes[superNodeIndex].nodes.push(nodes[index]); }
							}
						}
						snState--;
						break;
					}
					default:
						break;
				}
			} while (hasNodes);

			for(let i=0; i<superNodesPreData.length; i++) {
				// Generate data for new Super Node
				let superNodeId = ++circuitAnalCnt.fsupernode;
				let superNodeRef = 'SNf' + circuitAnalCnt.fsupernode;


				if(superNodesPreData[i].sNodeType === 1) {

				}
			}
		}
		else {
			if(superNodesPreData.length > 0) {
				// If it has only one Floating Super Node, just save it
				// Generate data for new Super Node
				let superNodeId = ++circuitAnalCnt.fsupernode;
				let superNodeRef = 'SNf' + circuitAnalCnt.fsupernode;
				let superNodeType = 1;
				let thisSuperNode = new supernode(superNodeId, superNodeRef, superNodeType, []);
				supernodes.push(thisSuperNode);
				let superNodeIndex = supernodes.length-1;
				for(let i=0; i<superNodesPreData[0].sNodesRef.length; i++) {
					// Find Node Index
					index = nodes.findIndex(item => item.ref === superNodesPreData[0].sNodesRef[i]);
					if(index > -1) { supernodes[superNodeIndex].nodes.push(nodes[index]); }
				}
			}
		}
		end = true;
	} while (!end);

	// Add All Nodes connected to remaining Isolated Voltage Supplies
	isolatedPS = JSON.parse(JSON.stringify(isolatedPsReg));
	isolatedPsElem = new Array();
	superNodesElem = new Array();	// Contains a list of Super Nodes nodes
	realNodesElem = new Array();	// Contains a list of the Real Nodes

	// Save a list of all isolated power supply end nodes
	for(let i=0; i<isolatedPS.length; i++) {
		isolatedPsElem.push(isolatedPS[i].noP);
		isolatedPsElem.push(isolatedPS[i].noN);
	}

	// Remove duplicated nodes references
	isolatedPsElem = [...new Set(isolatedPsElem)];
	isolatedPsElem.sort();

	// Save a list of all isolated power supply end nodes
	for(let i=0; i<nodes.length; i++) {
		if(nodes[i].type === 0) realNodesElem.push(nodes[i].ref);
	}
	// Remove duplicated nodes references
	realNodesElem = [...new Set(realNodesElem)];
	realNodesElem.sort();

	// Save a copy of the isolated power supplies list
	var isolatedPsElemReg = JSON.parse(JSON.stringify(isolatedPsElem));

	end = false;
	do {
		if(isolatedPsElem.length === 0) { end = true; }

		if(isolatedPS.length === 0) {
			for(let i=0; i<supernodes.length; i++) {
				for(let j=0; j<supernodes[i].nodes.length; j++) {
					let nextCheck = supernodes[i].nodes[j].ref;
					for(let k=0; k<isolatedPsElem.length; k++) {
						if(isolatedPsElem[k] === nextCheck) { isolatedPsElem.splice(k, 1); break; }
					}
				}
			}
		}
		for(let k=0; k<2; k++) {

			let nextPsNode;
			let oppositeNode
			for(let i=0; i<isolatedPS.length; i++) {
				if(k === 0) { nextPsNode = isolatedPS[i].noP; oppositeNode = isolatedPS[i].noN; }
				if(k === 1) { nextPsNode = isolatedPS[i].noN; oppositeNode = isolatedPS[i].noP; }

				for(let j=0; j<supernodes.length; j++) {
					try {
						let nodeIndex = supernodes[j].nodes.findIndex(item => item.ref === nextPsNode);
						if(nodeIndex > -1) {
							let nodeI = nodes.findIndex(item => item.ref === oppositeNode);
							try {
								isolatedPS.splice(i, 1);
								if(supernodes[j].nodes.findIndex(item => item.ref === oppositeNode) < 0) {
									supernodes[j].nodes.push(nodes[nodeI]);
									break;
								}
							} catch (error) {
								console.log('Super Nodes -> Opposite node not found: ' + oppositeNode);
							}
						}
					} catch (error) {
						console.log('Super Nodes -> Immediate node not found: ' + nextPsNode);
					}
				}
			}
		}
	} while (!end);


	// Update superNodesPreData
	superNodesPreData = [];
	for(let i=0; i<supernodes.length; i++) {
		let snId = supernodes[i].id;
		let snRef = supernodes[i].ref;
		let snType = supernodes[i].type;
		let nRef = new Array();
		for(let j=0; j<supernodes[i].nodes.length; j++) {
			nRef.push(supernodes[i].nodes[j].ref);
		}
		let sNodeData = {sNodeId: snId, sNodeRef: snRef, sNodeType: snType, sNodesRef: nRef};

		superNodesPreData.push(sNodeData);
	}

	// Find Best Position for the GND Node
	var bestSuperNodeGndPos = {betterGndPlaceCnt: 0, bestSuperNodesForGndPos: [null]};
	if(superNodesPreData.length) {
		let bestIndex = 0;
		let gndNodesCnt = 1;
		bestSuperNodeGndPos = {};
		bestSuperNodeGndPos = {betterGndPlaceCnt: gndNodesCnt, bestSuperNodesForGndPos: [superNodesPreData[0]]};
		for(let i=1; i<superNodesPreData.length; i++) {

			if(superNodesPreData[i].sNodesRef.length > superNodesPreData[bestIndex].sNodesRef.length) {
				bestSuperNodeGndPos = {};
				gndNodesCnt = 1;
				bestSuperNodeGndPos = {betterGndPlaceCnt: gndNodesCnt, bestSuperNodesForGndPos: [superNodesPreData[i]]};
				bestIndex = i;
				continue;
			}
			if(superNodesPreData[i].sNodesRef.length === superNodesPreData[bestIndex].sNodesRef.length) {
				gndNodesCnt++;
				bestSuperNodeGndPos.betterGndPlaceCnt = gndNodesCnt;
				bestSuperNodeGndPos.bestSuperNodesForGndPos.push(superNodesPreData[i]);
			}
		}
	}

	// Check if ground is missing
	if(netlistTxt.first.findIndex(item => item.errorCode === 14) > -1){
		// Add ground to the netlist
		if(bestSuperNodeGndPos.betterGndPlaceCnt > 0){
			let node = bestSuperNodeGndPos.bestSuperNodesForGndPos[0].sNodesRef[0];
			fileContents[1] = replaceNetNode(netlistTxt.second, node, "gnd");
			fileContents[2] = {
				errorCode: 14,
				newGnd: node
			};
		}
		else{
			let node = nodes.find(element => element.type === 0);
			fileContents[1] = replaceNetNode(netlistTxt.second, node.ref, "gnd");
			fileContents[2] = {
				errorCode: 14,
				newGnd: node.ref
			};

		}
		// Re-run the function
		loadFileAsTextMTN(data);
		return;

	}

	// Check if ground is in one of the best positions
	let bestGndChosen = false;
	if(bestSuperNodeGndPos.betterGndPlaceCnt > 0){
		for(let i = 0; i< bestSuperNodeGndPos.bestSuperNodesForGndPos.length; i++){
			if(bestSuperNodeGndPos.bestSuperNodesForGndPos[i].sNodesRef.includes("gnd")){
				bestGndChosen = true;
				$('#gndTip').hide();
				break;
			}
		}
	}

	if(!bestGndChosen && bestSuperNodeGndPos.betterGndPlaceCnt > 0){
		$('#gndTip').html(outGndTip(bestSuperNodeGndPos.bestSuperNodesForGndPos));
		$('#gndTip').show();


	}

	// Identify KNL Equations
	var knlEquations = new Array();
	var knlEquaCnt = countNodesByType(nodes, 0) - 1 - isolatedPsReg.length;
	let arrElem=new Array();
	// Prepare Current Equations (without considering Super Nodes)
	for(let i=0;i<nodes.length; i++) {
		let arrElem= nodes[i];
		if(arrElem.type === 0 && arrElem.ref !== 'gnd') {
			knlEquations.push({ node: arrElem.ref, currents: arrElem.getCurrents().second, plainEquation: arrElem.getCurrents().third });
		}
	}

	// Save Equations
	var knlEquationsReg = JSON.parse(JSON.stringify(knlEquations));

	/* From now on, there are 3 types of circuits (circuitType), related to the detection of Super Nodes:
		0 - Contains 0 Super Nodes;
		1 - Contains Super Nodes and one of them is Grounded;
		2 - Contains Super Nodes but none is Grounded.
		So, the code will Fork here.
	*/

	var circuitType = 0;
	var nodesInGroundedSN = new Array();
	var nodesInFloatingSN = new Array();
	var removedKnlEquat = new Array();

	// Get Grounded SuperNode Nodes List (except GND)
	supernodes.forEach(function(parentArrElem){
		if(parentArrElem.type === 0) {
			parentArrElem.nodes.forEach(function(childArrElem){
				if(childArrElem.ref !== 'gnd') nodesInGroundedSN.push(childArrElem.ref);
			});
		}
		if(parentArrElem.type === 1) {
			parentArrElem.nodes.forEach(function(childArrElem){
				if(childArrElem.ref !== 'gnd') nodesInFloatingSN.push(childArrElem.ref);
			});
		}
	});

	if(superNodesPreDataReg.length > 0) {
		let ampIndex = superNodesPreDataReg.findIndex(item => item.sNodeType === 0);
		if(ampIndex > -1) {
			circuitType = 1;
		}
		else circuitType = 2;
	}

	switch (circuitType) {
		case 1: {

			// Get SuperNode Nodes Voltage
			supernodes.forEach(function(arrElem){
				arrElem.calcGroundedVoltage(isolatedPsReg);
				arrElem.calcFloatingVoltage(isolatedPsReg);
			});
			// Is there any branch that has an isolated power supply?
			// If so, remove all equations containing, at least one node, in such condition

			// Remove equations for grounded super nodes
			for(let i=0; i<knlEquations.length; i++) {
				let ampIndex = superNodesPreDataReg.findIndex(item => item.sNodeType === 0);
				if(ampIndex > -1) {
					let objNode = knlEquations[i].node;
					nodesInGroundedSN.forEach(function(childArrElem) {
						if(objNode === childArrElem) { removedKnlEquat.push(knlEquations.splice(i, 1)); i--; }
					});
				}
			}

			// Get One equation per Floating Super Node
			supernodes.forEach(function(parentArrElem){
				if(parentArrElem.type === 1) {
					for(let i=1; i<parentArrElem.nodes.length; i++) {
						let nodeToRemove = parentArrElem.nodes[i].ref;
						let ampIndex = knlEquations.findIndex(item => item.node === nodeToRemove);
						if(ampIndex > -1) { removedKnlEquat.push(knlEquations.splice(ampIndex, 1)); }
					}
				}
			});


			break;
		}
		case 2: {

			// Get SuperNode Nodes Voltage
			supernodes.forEach(function(arrElem){
				arrElem.calcFloatingVoltage(isolatedPsReg);
			});

			// Get One equation per Floating Super Node
			supernodes.forEach(function(parentArrElem){
				if(parentArrElem.type === 1) {
					for(let i=1; i<parentArrElem.nodes.length; i++) {
						let nodeToRemove = parentArrElem.nodes[i].ref;
						let ampIndex = knlEquations.findIndex(item => item.node === nodeToRemove);
						if(ampIndex > -1) { let eq = knlEquations.splice(ampIndex, 1); removedKnlEquat.push(eq[0]); }
					}
				}
			});
			break;
		}
		default: {
			break;
		}
	}

	// Fill each current with the data to calculate the Ohm's Law (Uequivalent / Zequivalent)
	// If the branch has a current power supply, use that current value (direction has to be evaluated)

	// Produce Veq and Zeq
	branches.forEach(function(branch, ix, obj){
		branch.setCurrentOhmsLaw();
	});
	let size=currents.length;
currents=[];
for(let i=0; i<size; i++) {
	currents.push(branches[i].currentData)
};

	// Set ohmEquation or just the current value (if the branch has a current power supply)
	currents.forEach(function(arrElem){
		arrElem.setEquation()});

	// Produce final knl equations (for all equations)
	knlEquationsReg.forEach(function(knlEq, index, obj) {
		let arrNode = knlEq.node;
		let nodeIndex;
		let nextCurr;
		let currIndex;
		nodeIndex = nodes.findIndex(item => item.ref === arrNode);

		// Produce in each current the pair of node equations (1 for the End Node and another for the Start Node)
		knlEq.currents.forEach(function(currElem, currIndex, currObj) {

			nextCurr = currElem.currentObj.ref;
			currIndex = currents.findIndex(item => item.ref === nextCurr);
			let iterCurrData = nodes[nodeIndex].getCurrentsInOrderTo(nextCurr);
			let itDataFullPlainEq = iterCurrData.third;
			let itDataPlainEq = iterCurrData.fourth;
			let itDataObjEq = iterCurrData.fifth;
			let itDataNodeRef = nodes[nodeIndex].ref;
			currents[currIndex].pushNodeEquation({ nodeRef: itDataNodeRef, fullPlainEq: itDataFullPlainEq, plainEq: itDataPlainEq, equatObj: itDataObjEq });

		});
	});

	// Save first set of knl equations
	var knlFilteredEquations = JSON.parse(JSON.stringify(knlEquations));
	var stepSubstitutionsReg = new Array();

	// Substitute supernodes currents in the knl equations system
	knlEquations.forEach(function(knlEq, knlIndex, knlObj) {
		let iterEquation;
		let knlNode = knlEq.node;
		let knlFixedCurrents = new Array();
		let knlHasNoImpedance = new Array();
		let pastEquations = new Array();
		let stepSubstitutions = new Array();
		let currSubst = new Array();

		// If the knl equation doesn't have floating nodes, just put all terms in the left hand of the equation
		let ndIndex = nodesInFloatingSN.indexOf(knlNode);
		if(ndIndex < 0) {
			iterEquation = knlObj[knlIndex].plainEquation;
			let thisOldEq = algebra.parse(iterEquation);
			let thisEq = new Expression(0);
			thisOldEq.lhs.terms.forEach(function(termElem, termIndex, termObj) {
				let smallEq = termElem.variables[0].variable;
				thisEq = thisEq.add(smallEq);
			});
			thisOldEq.rhs.terms.forEach(function(termElem, termIndex, termObj) {
				let smallEq = termElem.variables[0].variable;
				thisEq = thisEq.subtract(smallEq);
			});
			thisEq = new Equation(thisEq, 0);
			knlObj[knlIndex] = { node: knlNode, currents: null, plainEquation: iterEquation, equatObj: thisEq };
		}
		else {
			let end = false;
			let mcState = 1;
			do {
				switch (mcState) {
					case 1: {
						iterEquation = knlObj[knlIndex].plainEquation;
						knlFixedCurrents = [];
						knlHasNoImpedance = [];
						knlObj[knlIndex].currents.forEach(function(currElem, currIndex, currObj) {
							if(currElem.currentObj.fixed) { knlFixedCurrents.push(currElem.currentObj.ref); }
							else {
								if(currElem.currentObj.impedance.impedanceElem.length === 0) knlHasNoImpedance.push(currElem.currentObj.ref);
							}
						});
						mcState++;
						break;
					}
					case 2: {
						if(knlHasNoImpedance.length === 0) { end = true; break;}
						let expr = algebra.parse(iterEquation);

						knlHasNoImpedance.forEach(function(currElem, currIndex, currObj) {
							let solvForCurExpObj = expr.solveFor(currElem);
							let solvForCurExp = expr.solveFor(currElem).toString();
							let thisCurrIndex = currents.findIndex(item => item.ref === currElem);
							if(thisCurrIndex > -1) {
								let subs = null;
								currents[thisCurrIndex].nodeEquations.forEach(function(ohmElm, ohmInd, ohmObj) {
									let ohmEq = algebra.parse(ohmElm.fullPlainEq);
									ohmEq = ohmEq.solveFor(currElem).toString();
									pastEquations.push(algebra.parse(ohmElm.fullPlainEq).toString());
									let compareExp = solvForCurExp;
									if(stepSubstitutions.length) {
										for(let i=0; i<stepSubstitutions.length; i++) {
											try {
												let exp1 = new Array();
												let exp2 = new Array();

												compareExp = algebra.parse(stepSubstitutions[i].oldFullEq);
												compareExp = compareExp.solveFor(currElem);
												let newEq = new algebra.Equation(compareExp, 0);

												newEq.lhs.terms.forEach(function(currElem, currIndex, currObj) {
													let currRef = currElem.variables[0].variable;
													exp1.push(currRef);
												});

												let ohmEqTemp = algebra.parse(ohmElm.fullPlainEq);
												ohmEqTemp = ohmEqTemp.solveFor(currElem);
												newEq = new algebra.Equation(ohmEqTemp, 0);
												newEq.lhs.terms.forEach(function(currElem, currIndex, currObj) {
													let currRef = currElem.variables[0].variable;
													exp2.push(currRef);
												});
												let len = exp1.length;
												let found = 0;
												if( len === exp2.length) {
													for(let j=0; j<len; j++) {
														index = exp2.indexOf(exp1[j]);
														if (index > -1) found++;
													}
												}
												if(len === found) { compareExp = ohmEq; break; }
											} catch (error) {
												compareExp = solvForCurExp;
											}
										}
									}
									if(compareExp === ohmEq && subs == null) {
										let oposInd = 1;
										if(ohmInd === 1) { oposInd = 0 };
										ohmEq = algebra.parse(ohmObj[oposInd].fullPlainEq);
										ohmEq = ohmEq.solveFor(currElem);
										subs = { nodeRef: knlNode, currRef: currElem, plainEq: ohmEq.toString(), expEq: ohmEq, oldFullEq: ohmObj[oposInd].fullPlainEq, oldOrigEq: iterEquation };
										currSubst.push(subs);
										stepSubstitutions.push(subs);
										stepSubstitutionsReg.push(subs);
									}
								});
							}
						});

						currSubst.forEach(function(ohmElm, ohmInd, ohmObj) {
							let solvForCurExpObj = expr.solveFor(ohmElm.currRef);
							let solvForCurExp = expr.solveFor(ohmElm.currRef).toString();
							let newEq = solvForCurExpObj.subtract(ohmElm.expEq);
							let newEqStr = newEq.toString();

							newEq = new algebra.Equation(newEq, 0);
							newEqStr = newEq.toString();
							expr = algebra.parse(newEqStr);
						});
						currSubst = [];

						let currObjArr = new Array();
						expr.lhs.terms.forEach(function(currElem, currIndex, currObj) {
							let currRef = currElem.variables[0].variable;
							let signal = currElem.coefficients[0].numer;
							let thisCurrIndex = currents.findIndex(item => item.ref === currElem);
							if(thisCurrIndex > -1) {
								let dir = 'in';
								if(signal === -1) dir = 'out';
								let currObj = { direction: dir, currentObj: currents[thisCurrIndex] };
								currObjArr.push(currObj);
							}
						});
						knlObj[knlIndex] = { node: knlNode, currents: currObjArr, plainEquation: expr.toString(), equatObj: expr }
						mcState--;
						break;
					}
					default:
						break;
				}
			} while (!end);
		}
	});

	// Save first set of knl equations without all floating supernodes currents
	var knlCurrEquations = JSON.parse(JSON.stringify(knlEquations));

	var knlEquationsVl = new Array();
	var knlOrderedCurrents = {
		original: new Array(),
		subs: new Array()};

	// Substitute every current by the ohm equation or fixed current (current power supply)
	knlEquations.forEach(function(knlEq, knlIndex, knlObj) {
		let newEquat = '';
		let newEquatVl = '';
		let orderedOrig = '';
		let orderedSubs = '';
		let newterm = '';
		let ohmEq = '';
		let ohmEqVl = '';
		knlEq.equatObj.lhs.terms.forEach(function(termElem, termIndex, termObj) {
			let signal = termElem.coefficients[0].numer;
			let variable = termElem.variables[0].variable;
			currIndex = currents.findIndex(item => item.ref === variable);
			if(currents[currIndex].fixed === 0) {
				let num = currents[currIndex].ohmEquation.equatObj.num.toString();
				let denum = currents[currIndex].ohmEquation.equatObj.denum.toString();
				ohmEq = currents[currIndex].ohmEquation.plainEq;
				ohmEq = math.parse(ohmEq);
				ohmEq = ohmEq.toString();

				ohmEqVl = currents[currIndex].ohmEquation.plainEqVl;

				if(signal > 0) {
					if(newEquat === '') {
						newEquat += ohmEq;
						newEquatVl += ohmEqVl;
						orderedSubs += variable;
						orderedOrig += variable; }
					else {
						newEquat += ' + ' + ohmEq;
						newEquatVl += ' + ' + ohmEqVl;
						orderedSubs += ' + ' + variable;
						orderedOrig += ' + ' + variable;}
				}
				if(signal < 0) {
					newEquat += ' - ' + ohmEq;
					newEquatVl += ' - ' + ohmEqVl;
					orderedSubs += ' - ' + variable;
					orderedOrig += ' - ' + variable;
				};
			}
			else {
				if(signal > 0) {
					if(newEquat === '') {
						newEquat += currents[currIndex].value;
						newEquatVl += currents[currIndex].value;
						orderedSubs += currents[currIndex].value;
						orderedOrig += variable;
					}
					else {
						newEquat += ' + ' + currents[currIndex].value;
						newEquatVl += ' + ' + currents[currIndex].value;
						orderedSubs += ' + ' + currents[currIndex].value;
						orderedOrig += ' + ' + variable;
					}
				}
				if(signal < 0) {
					newEquat += ' - ' + currents[currIndex].value;
					newEquatVl += ' - ' + currents[currIndex].value;
					orderedSubs += ' - ' + currents[currIndex].value;
					orderedOrig += ' - ' + variable;
				};
			}
		});
		// Remove + - issue from the expression String.raw
		let ex = math.parse(newEquat).toString();
		ex = ex.split('+ -').join(' - ');
		ex = ex.split('- -').join(' + ');
		let exVl = math.parse(newEquatVl).toString();
		exVl = exVl.split('+ -').join(' - ');
		exVl = exVl.split('- -').join(' + ');
		exVl = exVl.split('+0').join(' ');
		let exCurr = math.parse(orderedSubs).toString();
		exCurr = exCurr.split('+ -').join(' - ');
		exCurr = exCurr.split('- -').join(' + ');
		exCurr = exCurr.split('+0').join(' ');
		let exOrig = math.parse(orderedOrig).toString();
		exOrig = exOrig.split('+ -').join(' - ');
		exOrig = exOrig.split('- -').join(' + ');
		exOrig = exOrig.split('+0').join(' ');

		// set right member of the equation
		ex = math.parse(ex);
		ex += ' = 0';
		knlObj[knlIndex] = ex.toString();

		exVl = math.parse(exVl);
		exVl += ' = 0';
		knlEquationsVl.push(exVl.toString());

		exCurr = math.parse(exCurr);
		exCurr += ' = 0';
		knlOrderedCurrents.subs.push(exCurr.toString());

		exOrig = math.parse(exOrig);
		exOrig += ' = 0';
		knlOrderedCurrents.original.push(exOrig.toString());
	});


	// Create Equations for every Super Node nodes, related to the chosen node for the knl equations
	superNodesEndPoints = new Array();

	// Array of floating nodes Equations
	superNodeFloatingVoltRelation = new Array();
	var snRefs = new Array();

	isolatedPsReg.forEach(function(isElem, isIndex, isObj) {
		let psRef = isElem.ref;
		let sNode = isElem.noP;
		let eNode = isElem.noN;
		let signal;
		let nRef;
		let psValue;

		let psIndex = dcVoltPs.findIndex(item => item.ref === psRef);
		if(psIndex > -1) {
			nRef = dcVoltPs[psIndex].noP;
			if(nRef === sNode) signal = ' + ';
			else signal = ' - ';
			psValue = dcVoltPs[psIndex].voltage;
		}

		psIndex = acVoltPs.findIndex(item => item.ref === psRef);
		if(psIndex > -1) {
			nRef = acVoltPs[psIndex].noP;
			if(nRef === sNode) signal = ' + ';
			else signal = ' - ';
			psValue = acVoltPs[psIndex].voltage;
		}

		let rEq = eNode + signal + psRef;
		let fullRefEq = sNode + ' = ' + eNode + ' ' + signal + ' ' + psRef;
		let nEq = sNode + ' = ' + eNode + ' ' + signal + ' ' + psValue;

		snRefs.push( { ref: nRef, numEquat: nEq , refEquat: rEq, fullRefEquat: fullRefEq } );

		let ndIndex = nodesInGroundedSN.indexOf(nRef);
		if(ndIndex < 0 && nRef !== 'gnd') {
			superNodeFloatingVoltRelation.push( { nodeRef: nRef, refEqu: fullRefEq, numEq: nEq, endNode: eNode, signal: signal, psRef: psRef, refEquat: rEq} );
			//superNodeFloatingVoltRelation.push( { nodeRef: nRef, refEqu: fullRefEq, numEq: nEq } );
			//ref: nRef, endNode: eNode, signal: signal, psRef: psRef, numEquat: nEq, refEquat: rEq, fullRefEquat: fullRefEq
		}
	});


	supernodes.forEach(function(snElem, snIndex, snObj) {
		if(snElem.type === 1) {
			let snRefs = new Array();

			snElem.nodes.forEach(function(nElem, nIndex, nObj) {
				let nRef = nElem.ref;
				let nEq = nElem.voltage.volteq;
				let sNode = nElem.voltage.equivVoltPs.voltsElem[0].startNode;
				let eNode = nElem.voltage.equivVoltPs.voltsElem[0].endNode;
				if(eNode === nRef) { eNode = sNode; sNode = nRef; }
				let psRef = nElem.voltage.equivVoltPs.voltsElem[0].ref;
				let signal;
				dcVoltPs.forEach(function(cpElem, cpIndex, cpObj) {
					if(cpElem.ref === psRef) {
						if(cpElem.noP === nRef) signal = ' + ';
						else signal = ' - ';
					}
				});
				acVoltPs.forEach(function(cpElem, cpIndex, cpObj) {
					if(cpElem.ref === psRef) {
						if(cpElem.noP === nRef) signal = ' + ';
						else signal = ' - ';
					}
				});

				let rEq = eNode + signal + psRef;
				let fullRefEq = sNode + ' = ' + eNode + signal + psRef;
				snRefs.push( { ref: nRef, endNode: eNode, signal: signal, psRef: psRef, numEquat: nEq, refEquat: rEq, fullRefEquat: fullRefEq } );
				//superNodeFloatingVoltRelation.push( { sNodeRnodeRef: nRef, refEqu: fullRefEq, numEq: nRef + ' = ' + nEq } );

			});
			superNodesEndPoints.push( { superNodeElems: snRefs, superNodeObjs: snObj } );
		}
	});

	// Add the bridge equation to the other branch of the first node


	// Save nodes used as reference in Floating SuperNodes
	var superNodeFloatingVoltRelationReg = JSON.parse(JSON.stringify(superNodeFloatingVoltRelation));

	// Find and produce a list of nodes grouped in the Floating Super Nodes
	var knlFloatingEqNodes = new Array();
	knlFilteredEquations.forEach(function(knlEq, knlIndex, knlObj) {
		let nodeRef = knlEq.node;
		supernodes.forEach(function(snEl, snIndex, snObj) {
			if(snEl.type === 1) {
				nodeIndex = snEl.nodes.findIndex(item => item.ref === nodeRef);
				if(nodeIndex > -1) knlFloatingEqNodes.push(knlEq.node);
			}
		});
	});

	// Remove equations of the nodes used as reference nodes for the floating Super Nodes
	superNodeFloatingVoltRelation.forEach(function(snElem, snIndex, snObj) {
		// remove nodes
		let index = knlFloatingEqNodes.indexOf(snElem.nodeRef);
		if (index > -1) { snObj.splice(snIndex, 1); }
	});

	// Save first set of knl system equations with all floating supernodes currents
	var knlSystemEquationsReg = JSON.parse(JSON.stringify(knlEquations));

	// Add Floating Super Nodes Voltage
	superNodeFloatingVoltRelationReg.forEach(function(knlEq, knlIndex, knlObj) {
		knlEquations.push(knlEq.refEqu);
		knlEquationsVl.push(knlEq.numEq);
	});


	nodesInGroundedSN.forEach(function(snElem, snIndex, snObj) {
		let index = nodes.findIndex(item => item.ref === snElem);
		if (index > -1) {
			let newEq = snElem + ' = ' + nodes[index].voltage;
			knlEquations.push(newEq);
		}
	});

	// Produce a list of the equation unknowns
	var equationUnknowns = new Array();
	knlFilteredEquations.forEach(function(tE, tI, tO) {
		equationUnknowns.push(tE.node);
	});

	// Save the End Points of nodes used in the Floating SuperNodes
	var superNodesEndPointsReg = JSON.parse(JSON.stringify(superNodesEndPoints));

	var superNodesRelationToRef = new Array();

	superNodesEndPoints.forEach(function(tE, tI, tO) {

		let thisIndex = -1;
		let nodeToFind;
		let nodeEqRef;
		let modEq;
		let modEquations = new Array();
		let len = tE.superNodeElems.length;

		// Set reference node for the equations
		equationUnknowns.forEach(function(eE, eI, eO) {
			if(eE === tE.superNodeElems[0].ref) nodeEqRef = eE;
		});

		let end = false;
		let mcs = 1;

		do {
			switch (mcs) {
				case 1: {
					thisIndex++;
					if(thisIndex >= len) { end = true; break; }
					nodeToFind = tE.superNodeElems[thisIndex].ref;

					// If there is a supernode containing just 2 nodes, save equations and quit
					if(len <= 2) {
						if(nodeToFind == nodeEqRef) { break; }
						modEq = {
							ref: nodeToFind,
							fullCasEq: tE.superNodeElems[thisIndex].fullRefEquat,
							casEq: tE.superNodeElems[thisIndex].refEquat,
							fullNumEq: nodeToFind + ' = ' + tE.superNodeElems[thisIndex].numEquat,
							numEq: tE.superNodeElems[thisIndex].numEquat
						};
						superNodesRelationToRef.push( modEq );
						break;
					}

					modEq = { casEq: tE.superNodeElems[thisIndex].fullRefEquat, numEq: nodeToFind + ' = ' + tE.superNodeElems[thisIndex].numEquat };
					nodeToFind = tE.superNodeElems[thisIndex].endNode;

					mcs++;
					break;
				}
				case 2: {
					let nextNodeIndex = tE.superNodeElems.findIndex(item => item.ref === nodeToFind);
					if(nextNodeIndex > -1) {
						modEq.casEq += ' + ' + tE.superNodeElems[nextNodeIndex].refEquat;
						modEq.numEq += ' + ' + tE.superNodeElems[nextNodeIndex].numEquat;
					}

					mcs--;
					break;
				}
				default:
					break;
			}
		} while (!end);

	});


	/** Rearrange equation system in order to the unkown variables
	 * 1 - Get the Unknown Variables
	 * 2 - Get the rest of the nodes
	 * 3 - Find the rest of the nodes in the KNL Equations
	 * 4 - Replace each node for its equivalent expression
	 * 	   until the unknown variable is reached
	 */
	var results = new Array();
	var inOrderEquations = new Array();

	// Get nodes except system unknowns
	var otherNodes = new Array();
	for (let i = 0; i < knlEquationsReg.length; i++){
		if(!equationUnknowns.includes(knlEquationsReg[i].node))
			otherNodes.push(knlEquationsReg[i].node)
	}

	// Create the nodes substitutions to insert in the system equation solver
	// Nodes CANNOT have more than 2 letters in the equations
	var nodeSubstitutions = new Array();
	var currentNodes = knlEquationsReg.map(a => a.node);
	var doubleLetterNodes = new Array();
	for(let i = 0; i< currentNodes.length; i++){
		if(currentNodes[i].length > 1){
			doubleLetterNodes.push(currentNodes[i]);
			currentNodes.splice(i,1);
			i--;
		}
	}
	for(let i = 0; i< doubleLetterNodes.length; i++){
		let obj = {
			prevNode: doubleLetterNodes[i],
			subsNode: findNewNode(currentNodes)
		};
		nodeSubstitutions.push(obj);
		currentNodes.push(obj.subsNode);
	}


	// Find non-variable nodes in the KNL Equations
	var nonVarFound = new Array();
	for (let i = 0; i < knlEquaCnt; i++){
		for(let j = 0; j < otherNodes.length; j++){
			if(knlEquationsVl[i].includes(otherNodes[j]))
				nonVarFound.push(otherNodes[j]);
		}
	}

	// Fix the exponentials
	for(let i = 0; i < knlEquationsVl.length; i++){
		knlEquationsVl[i] = findSubstringIndexes(knlEquationsVl[i],'e');
	}

	// Get the known node voltages (grounded supernodes)
	if(nodesInGroundedSN.length > 0){
		// Get equation index
		let gSNindex = knlEquationsVl.length;
		for(let i = 0; i < nodesInGroundedSN.length; i++){
			for(let j = gSNindex; j< knlEquations.length; j++){
				if(knlEquations[j].includes(nodesInGroundedSN[i])){
					let eq = parsegroundedSN(knlEquations[j],nodesInGroundedSN[i]);
					let nodeObj = {
						node: nodesInGroundedSN[i],
						equation: eq
					};
					inOrderEquations.push(nodeObj);
					nodeObj = {
						node: nodesInGroundedSN[i],
						value: eq
					}
					results.push(nodeObj);
				}
			}
		}
	}


	// Get direct nodes equations
	if(nonVarFound.length>0){
		// Remove duplicated nodes
		nonVarFound = [... new Set(nonVarFound)];
		// Get the Supernodes equations
		var nodesEq = new Array();
		for(let i = knlEquaCnt; i <knlEquationsVl.length; i++){
			nodesEq.push(knlEquationsVl[i]);
		}

		// Go through non-variable nodes
		let nodeInstances = new Array();
		// Find the direct relationships first
		for(let i = 0; i < nonVarFound.length; i++){
			// Clear array
			nodeInstances = [];
			// Search the node instances
			for(let j = 0; j < nodesEq.length; j++ ){
				if(nodesEq[j].includes(nonVarFound[i]))
					nodeInstances.push(nodesEq[j]);
			}

			// Try to get a direct relation
			for(let j = 0; j < nodeInstances.length; j++){
				for(let unk = 0; unk < equationUnknowns.length; unk++){
					// If the unknown is found create the equation
					if(nodeInstances[j].includes(equationUnknowns[unk])){
						// Separate terms
						let str = nodeInstances[j];
						str = str.split('=');
						//Check if the node is the first term;
						if(str[0].includes(nonVarFound[i])){
							let nodeObj = {
								node: nonVarFound[i],
								equation: '('+str[1]+')'
							};
							// Save equation
							inOrderEquations.push(nodeObj);
							// Break From cycles
							unk = equationUnknowns.length;
							j = nodeInstances.length;
						}
						else{
							let nodeObj = {
								node: nonVarFound[i],
								equation: parseDirectEquation(nodeInstances[j],nonVarFound[i])
							}
							// Save equation
							inOrderEquations.push(nodeObj);
							// Break From cycles
							unk = equationUnknowns.length;
							j = nodeInstances.length;
						}
					}
				}
			}
		}


		var nodesLeft = new Array();
		var nodesEqleft = new Array();
		// Get the indirect nodes left for substitution
		for(let i = 0; i < nonVarFound.length; i++ ){
			if(!inOrderEquations.some(el => el.node === nonVarFound[i]))
				nodesLeft.push(nonVarFound[i]);
		}
		// Get the indirect nodes equations
		for(let i = 0; i < nodesLeft.length; i++){
			for(let j = 0; j < nodesEq.length; j++ ){
				if(nodesEq[j].includes(nodesLeft[i]))
					nodesEqleft.push(nodesEq[j]);
			}
		}
		// Remove duplicated
		nodesEqleft = [... new Set(nodesEqleft)];

		while(nodesLeft.length > 0){
			// Cycle through nodes left
			for(let i = 0; i < nodesLeft.length; i++){
				let nodeEq = [];
				// Get the node Equations
				for(let j = 0; j < nodesEqleft.length; j++){
					if(nodesEqleft[j].includes(nodesLeft[i]))
						nodeEq.push(nodesEqleft[j]);
				}

				// Try to find an ordered node equation
				for(let j = 0; j < nodeEq.length; j++){
					for(let k = 0; k < inOrderEquations.length; k++){
						if(nodeEq[j].includes(inOrderEquations[k].node)){
							// Replace the node with its expression
							nodeEq[j] = nodeEq[j].replace(inOrderEquations[k].node, inOrderEquations[k].equation);
							let str = parseNonDirectEquation(nodeEq[j],nodesLeft[i]);
							// Add to the parsed List
							let nodeObj = {
								node: nodesLeft[i],
								equation: str
							}
							inOrderEquations.push(nodeObj);
							nodesLeft.splice(i,1);
							i--;
							// Break from cycles
							k = inOrderEquations.length;
							j = nodeEq.length;
						}
					}
				}
			}
		}
	}

	// Get the KNL equations
	var knlSubstitutions = new Array();
	for(let i=0; i < knlEquaCnt; i++){
		knlSubstitutions.push(knlEquationsVl[i]);
	}

	// Make the substitutions
	for(let i = 0; i < knlSubstitutions.length; i++){
		for(let j = 0; j < inOrderEquations.length; j++){
			if(knlSubstitutions[i].includes(inOrderEquations[j].node)){
				let reg = new RegExp(inOrderEquations[j].node, "g");
				knlSubstitutions[i] = knlSubstitutions[i].replace(reg, inOrderEquations[j].equation);
			}
		}
	}

	// Remove the " = 0" from the equations
	var equationArray = new Array();
	for(let i = 0; i < knlSubstitutions.length; i++){
		let aux = knlSubstitutions[i].split(" = ");
		equationArray.push(aux[0]);
	}

	/* Aggregate Equation Systems
		Put together the equations with common variables
		Necessary for the math.js equation solver
	*/

	var equationSystems = new Array();
	var eqSystem = new Array();

	for(let i = 0; i < equationArray.length; i++){
		// Check the existing Unknowns in the equation
		let eqVar = checkEquationUnk(equationArray[i],equationUnknowns);
		let nVars = eqVar.length;
		// An equation system has always more than one variable
		if(nVars > 1){
			eqSystem.push(equationArray[i]);
			equationArray.splice(i,1);
			i--;
			// Find the other equations
			for(let k = 0; k < equationArray.length; k++){
				// If the equation includes some of the variables
				if(eqVar.some(v => equationArray[k].includes(v))){
					// Add to the array
					eqSystem.push(equationArray[k]);
					// Remove it
					equationArray.splice(k,1);
					k--;
				}
			}
			equationSystems.push(eqSystem);
			eqSystem = [];
		}
	}

	/** Results object:
	 * node (string)
	 * value (string)/number
	 */

	let realNodesobj = nodes.filter(function(item) {return  item.type === 0;})
	let realNodes = realNodesobj.map(item => item.ref);
	let nodeCnt = realNodes.length;
	let realNodesReg = new Array()
	realNodesReg = realNodesReg.concat(realNodes);
	var eqSystem = new linearEqSystem();
	// Evaluate the single variable equations
	for(let i = 0; i < equationArray.length; i++){
		eqSystem = new linearEqSystem();
		equationArray[i] = fixDoubleNamedNodes(equationArray[i],nodeSubstitutions);
		eqSystem.addEquation(equationArray[i]);
		eqSystem.buildSystem();
		let res = solve(eqSystem.coefMatrix, eqSystem.consMatrix, eqSystem.varMatrix, 3);

		let index = nodeSubstitutions.findIndex(x => x.subsNode === res.variables._data[0][0]);
		if( index !== -1)
			res.variables._data[0][0] = nodeSubstitutions[index].prevNode;

		let obj = {
			node: res.variables._data[0][0],
			value: parseComplex(res.result._data[0][0]),
			unit: "V"
		}
		results.push(obj);
	}

	// Solve the equation systems
	var subEqSystem = new linearEqSystem();
	for(let i = 0; i < equationSystems.length; i++){
		for(let k = 0; k < equationSystems[i].length; k++){
			equationSystems[i][k] = fixDoubleNamedNodes(equationSystems[i][k],nodeSubstitutions);
			subEqSystem.addEquation(equationSystems[i][k]);
		}
		subEqSystem.buildSystem();
		let res = solve(subEqSystem.coefMatrix, subEqSystem.consMatrix, subEqSystem.varMatrix, 3);
		for(let k = 0; k<res.variables._data.length; k++){
			let index = nodeSubstitutions.findIndex(x => x.subsNode === res.variables._data[k][0]);
			if( index !== -1)
				res.variables._data[k][0] = nodeSubstitutions[index].prevNode;
			let obj = {
				node: res.variables._data[k][0],
				value: parseComplex(res.result._data[k][0]),
				unit: "V"
			}
			results.push(obj);
		}
	}

	// Get Supernodes remaining equations
	var remainingSN = knlEquationsVl.slice(knlEquaCnt);
	//Substitute the known node voltages
	while(remainingSN.length > 0){
		for(let i = 0; i < remainingSN.length; i++){
			for(let k = 0; k < results.length; k++){
				if(remainingSN[i].includes(results[k].node)){
					remainingSN[i] = remainingSN[i].replace(results[k].node,results[k].value);
					let varNode = getSNnode(remainingSN[i],realNodesReg);
					let auxStr = parseDirectEquation(remainingSN[i],varNode);
					let parser = math.parser();
					let obj = {
						node: varNode,
						value: parser.evaluate(auxStr).toString(),
						unit: "V"
					}
					results.push(obj);
					remainingSN.splice(i,1);
					i = remainingSN.length;
					k = results.length;
				}

			}
		}
	}

	// Get currents results (For currents outside isolated VS branches)
	let resultsCurr = new Array();
	let parseCurr = math.parser();
	for(let i = 0; i<currents.length; i++){

		let obj = {
			ref: currents[i].ref,
			value: 0,
			eq: '',
			unit: 'A',
			fromSN: false,
			fromAC: false
		}

		if(currents[i].value == null && currents[i].ohmEquation != null){
			let equation = math.parse(currents[i].ohmEquation.plainEqVl);
			let eq = math.simplify(equation).toTex();
			equation = math.simplify(equation).toString();
			eq = currents[i].ref + " = " + eq;
			// Get TeX Equation
			for(let k = 0; k < realNodes.length; k++){
				eq = eq.replace(new RegExp(realNodes[k], 'g'),"V_{"+realNodes[k]+'}');
			}
			// Compute Value
			for(let k = 0; k< results.length; k++){
				if(equation.includes(results[k].node))
					equation = equation.replace(results[k].node,'('+results[k].value+')');
			}
			let currentRes = parseCurr.evaluate(equation).toString();
			obj.value = currentRes;
			obj.eq = eq;
		}
		else{
			obj.value = currents[i].value;
			obj.eq = currents[i].ref + " = " + currents[i].value;
			if(obj.value!= null)
				obj.fromAC = true;
		}
		resultsCurr.push(obj);
	}

	// Get the remaining currents (from SN branches)
	while(resultsCurr.filter(function(item) {return  item.value === null;}).length > 0){
		for(let i = 0; i< resultsCurr.length; i++){
			if(resultsCurr[i].value == null){
				//Find the current ID
				let index = currents.findIndex(curr => curr.ref === resultsCurr[i].ref);
				for(let k = 0; k< currents[index].nodeEquations.length; k++){
					let nodeEq = currents[index].nodeEquations[k];
					let isValid = true;
					let neededCurrents = new Array();
					let neededCurrValues = new Array();
					for(let j = 0; j< nodeEq.equatObj.minusCurr.length; j++){
						// Check if each current already has value
						let currIndex = resultsCurr.findIndex(curr => curr.ref === nodeEq.equatObj.minusCurr[j]);
						if(nodeEq.equatObj.minusCurr[j] !== resultsCurr[i].ref){
							neededCurrents.push(nodeEq.equatObj.minusCurr[j]);
							neededCurrValues.push(resultsCurr[currIndex].value);
						}
						if(resultsCurr[currIndex].value == null && nodeEq.equatObj.minusCurr[j] !== resultsCurr[i].ref){
							isValid = false;
							break;
						}
					}
					for(let j = 0; j< nodeEq.equatObj.plusCurr.length; j++){
						let currIndex = resultsCurr.findIndex(curr => curr.ref === nodeEq.equatObj.plusCurr[j]);
						if(nodeEq.equatObj.plusCurr[j] !== resultsCurr[i].ref){
							neededCurrents.push(nodeEq.equatObj.plusCurr[j]);
							neededCurrValues.push(resultsCurr[currIndex].value);
						}
						if(resultsCurr[currIndex].value == null && nodeEq.equatObj.plusCurr[j] !== resultsCurr[i].ref){
							isValid = false;
							break;
						}
					}

					// If the current is valid, assign the equation and compute value
					if(isValid === true){
						resultsCurr[i].eq = math.parse(nodeEq.fullPlainEq).toString();
						let equation = nodeEq.plainEq;
						let scope = {};
						for(let j = 0; j< neededCurrents.length; j++){
							// Create scope
							//scope[neededCurrents[j]] = neededCurrValues[j];
							equation = equation.replace(neededCurrents[j],'('+neededCurrValues[j]+')');
						}
						resultsCurr[i].value = math.evaluate(equation).toString();
						resultsCurr[i].fromSN = true;
						// Move to the last index
						resultsCurr.push(resultsCurr.splice(i, 1)[0]);
						break;
					}
				}
			}
		}
	}


	// Set up a scale for node voltages results
	let nodeVoltages = results.map(a => a.value);
	// Remove parenthesis
	for(let i = 0; i< nodeVoltages.length; i++){
		nodeVoltages[i] = nodeVoltages[i].replace(/[()]/g, '');
	}
	let nodeUnits = new Array();
	// Check the values magnitude
	for(let i = 0; i < nodeVoltages.length; i++){
		// Check number of zeros after comma
		let value = Math.abs(parseFloat(nodeVoltages[i]));
		let decimals = - Math.floor( Math.log(value) / Math.log(10) + 1);
		if(decimals < 2 || value >= 1 || value === 0)
			nodeUnits.push("V");
		else if(decimals < 4 && value < 1)
			nodeUnits.push("mV");
		else
			nodeUnits.push("uV");
	}

	// Get the most frequent unit in the results
	let unit = findMode(nodeUnits);

	// Do the conversion and round it to 3 decimal places
	for(let i = 0; i < nodeVoltages.length; i++){
		results[i].value = voltConversion(nodeVoltages[i],unit,3);
		results[i].unit = unit;
	}


	// Set up a scale for currents results
	nodeUnits = [];
	// Check the values magnitude
	for(let i = 0; i < resultsCurr.length; i++){
		// Check number of zeros after comma
		let value = Math.abs(parseFloat(resultsCurr[i].value));
		let decimals = - Math.floor( Math.log(value) / Math.log(10) + 1);
		if(decimals < 2 || value >= 1 || value === 0)
			nodeUnits.push("A");
		else if(decimals < 4 && value < 1)
			nodeUnits.push("mA");
		else
			nodeUnits.push("uA");
	}

	// Get the most frequent unit in the results
	unit = findMode(nodeUnits);

	// Do the conversion and round it to 3 decimal places
	for(let i = 0; i < resultsCurr.length; i++){
		resultsCurr[i].value = ampConversion(resultsCurr[i].value.toString(),unit,3);
		resultsCurr[i].unit = unit;
	}

	// Prepare supernodes Equations for steps (Floating)
	let snEquations = knlEquations.splice(knlEquaCnt);
	let doneNodes = new Array();
	let SNFobjects = new Array();

	for(let i = 0; i< supernodes.length; i++){
		if(supernodes[i].type === 1){
			supernodes[i].SNFs = new Array();
			let nodesInSN = supernodes[i].nodes.map(item => item.ref);
			// Get the Unknown Node
			let unknown = nodesInSN.filter(element => equationUnknowns.includes(element));
			unknown = unknown[0];
			// Remove it from nodes
			realNodes = realNodes.filter(e => e !== unknown);
			while(doneNodes.length < supernodes[i].nodes.length-1){
				for(let k = 0; k < snEquations.length; k++){
					if(snEquations[k].includes(unknown)){
						// Find the other node to solveFor
						let node = realNodes[searchNode(snEquations[k],realNodes)];
						let expr = algebra.parse(snEquations[k]);
						let obj = {
							ref: node,
							equation: '('+expr.solveFor(node).toString()+')'
						};
						SNFobjects.push(obj);
						doneNodes.push(node);
						snEquations.splice(k,1);
						k--;
					}
					else if(searchNode(snEquations[k],doneNodes) > -1){
						let nodeindex = searchNode(snEquations[k],doneNodes);
						snEquations[k] = snEquations[k].replace(doneNodes[nodeindex], SNFobjects[nodeindex].equation)
					}
				}
			}

			for(let j = 0; j<SNFobjects.length; j++){
				let aux = math.parse(SNFobjects[j].equation);
				SNFobjects[j].equation = math.simplify(aux,{}, {exactFractions: false}).toTex();
				SNFobjects[j].equation = SNFobjects[j].equation.replace("+-","-");
				SNFobjects[j].equation = SNFobjects[j].equation.replace("--","+");
			}
			supernodes[i].SNFs = SNFobjects;
			SNFobjects = [];
			doneNodes = [];
		}
	}

	// Prepare supernodes Equations for steps (Grounded)
	let SNGobjects = new Array();
	let nodesToSearch = new Array();

	for(let i = 0; i< supernodes.length; i++){
		if(supernodes[i].type === 0){
			supernodes[i].SNGs = new Array();
			let foundNodes=new Array();
			// Get all nodes
			nodesToSearch = supernodes[i].nodes.map(item => item.ref);
			// Start off with ground
			let gndIndex = supernodes[i].nodes.findIndex(node => node.ref === "gnd");
			nodesToSearch.splice(nodesToSearch.indexOf("gnd"),1);
			let completeFlag = 0;
			for(let k = 0; k< supernodes[i].nodes[gndIndex].branches.length; k++){
				let branch = supernodes[i].nodes[gndIndex].branches[k];
				if(nodesToSearch.includes(branch.startNode)){
					foundNodes.push(branch.startNode);
					let equation = "V_{" + branch.startNode + "} = 0";
					for(let j = 0; j< branch.endVoltPsEndNodes.length; j++){
						if(branch.endVoltPsEndNodes[j].endNode === branch.startNode){
							equation += " + " + branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
						else{
							equation += " - " + branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}

					}
					if(completeFlag === 1){
						let obj = {
							node: branch.startNode,
							equation: equation
						}
						SNGobjects.push(obj);
						completeFlag = 0;
					}
				}
				else if( nodesToSearch.includes(branch.endNode)){
					foundNodes.push(branch.endNode);
					let equation = "V_{" + branch.endNode + "} = 0";
					for(let j = 0; j<  branch.endVoltPsEndNodes.length; j++){
						if( branch.endVoltPsEndNodes[j].endNode === branch.endNode){
							equation += " + " +  branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
						else{
							equation += " - " +  branch.endVoltPsEndNodes[j].voltPsRef;
							completeFlag = 1;
						}
					}
					if(completeFlag === 1){
						let obj = {
							node: branch.endNode,
							equation: equation
						}
						SNGobjects.push(obj)
						completeFlag = 0;
					}
				}
			}

			// Remove the nodes with a equation already created
			for(let k = 0; k<foundNodes.length; k++){
				nodesToSearch.splice(nodesToSearch.indexOf(foundNodes[k]),1);
			}
			// Complete the grounded supernode remaining nodes
			for(let k = 0; k<nodesToSearch.length; k++){
				// Find node object
				let nodeIndex = supernodes[i].nodes.findIndex(node => node.ref === nodesToSearch[k]);
				for(let j = 0; j< supernodes[i].nodes[nodeIndex].branches.length; j++){
					let branch = supernodes[i].nodes[nodeIndex].branches[j];
					// Find a connection
					let findNext = SNGobjects.findIndex(n => n.node === branch.startNode);
					let foundisolPS = false;
					if(branch.dcVoltPwSupplies.length > 0){
						if(isolatedPsReg.findIndex(item => item.ref === branch.dcVoltPwSupplies[0].ref) > -1)
							foundisolPS = true;
					}
					if(branch.acVoltPwSupplies.length > 0 && foundisolPS === false){
						if(isolatedPsReg.findIndex(item => item.ref === branch.acVoltPwSupplies[0].ref) > -1)
							foundisolPS = true;
					}
					if(findNext > -1 && foundisolPS === true){
						let equation = "V_{" + nodesToSearch[k] + "} = V_{" + SNGobjects[findNext].node +"}";
						for(let f = 0; f<  branch.endVoltPsEndNodes.length; f++){
							if( branch.endVoltPsEndNodes[f].endNode === nodesToSearch[k])
								equation += " + " +  branch.endVoltPsEndNodes[f].voltPsRef;
							else
								equation += " - " +  branch.endVoltPsEndNodes[f].voltPsRef;
						}
						let obj = {
							node: nodesToSearch[k],
							equation: equation
						}
						SNGobjects.push(obj);
						break;
					}
					findNext = SNGobjects.findIndex(n => n.node === branch.endNode);
					if(findNext > -1 && foundisolPS === true){
						let equation = "V_{" + nodesToSearch[k] + "} = V_{" + SNGobjects[findNext].node +"}";
						for(let f = 0; f<  branch.endVoltPsEndNodes.length; f++){
							if( branch.endVoltPsEndNodes[f].endNode === nodesToSearch[k])
								equation += " + " +  branch.endVoltPsEndNodes[f].voltPsRef;
							else
								equation += " - " +  branch.endVoltPsEndNodes[f].voltPsRef;
						}
						let obj = {
							node: nodesToSearch[k],
							equation: equation
						}
						SNGobjects.push(obj);
						break;
					}
				}
			}
			supernodes[i].SNGs = SNGobjects;
			SNGobjects = [];
		}
	}

	// Compute any remaining equations
	let leftNodes = new Array();
	for(let i = 0; i< isolatedPsElemReg.length; i++){
		if((inOrderEquations.findIndex(x => x.node === isolatedPsElemReg[i]) < 0) &&
			(!equationUnknowns.includes(isolatedPsElemReg[i])) && (isolatedPsElemReg[i]!=="gnd"))
			leftNodes.push(isolatedPsElemReg[i])
	}

	for(let j = 0; j< leftNodes.length; j++){
		for(let i = 0; i< nodesEq.length; i++){
			if(nodesEq[i].includes(leftNodes[j])){
				for(let k = 0; k<inOrderEquations.length; k++){
					if(nodesEq[i].includes(inOrderEquations[k].node)){
						let strEquation = nodesEq[i];
						strEquation = strEquation.replace(inOrderEquations[k].node, inOrderEquations[k].equation);
						strEquation = algebra.parse(strEquation);
						strEquation = strEquation.solveFor(leftNodes[j]).toString();

						let obj = {
							node: leftNodes[j],
							equation: strEquation
						}
						inOrderEquations.push(obj);
						break;
					}
				}
			}
		}
	}

	// Get Knl Currents Data
	let knlCurrData = outCurrentsKNL(knlCurrEquations,supernodes);

	// Fix decimal places at substitutions
	for(let i = 0; i< knlSubstitutions.length; i++)
		knlSubstitutions[i] = fixDecimals(knlSubstitutions[i],3);
	for(let i = 0; i< knlEquationsVl.length; i++)
		knlEquationsVl[i] = fixDecimals(knlEquationsVl[i],3);
	for(let i = 0; i< resultsCurr.length; i++)
		resultsCurr[i].eq = fixDecimals(resultsCurr[i].eq,3);

	// Get equation system
	let knlSimplified = new Array();
	knlSimplified = knlSimplified.concat(knlSubstitutions);
	math.type.Fraction.REDUCE = false;
	for(let i = 0; i< knlSimplified.length; i++){
		// Remove = 0
		knlSimplified[i] = knlSimplified[i].replace(/\s+/g, '');
		knlSimplified[i] = knlSimplified[i].replace('=0', '');
		knlSimplified[i] = math.parse(knlSimplified[i]);
		knlSimplified[i] = math.simplify(knlSimplified[i]).toString();
		knlSimplified[i] = fixEquation(knlSimplified[i]);
		knlSimplified[i] = math.simplify(knlSimplified[i]).toTex();
		knlSimplified[i] = fixEquation(knlSimplified[i]);
		knlSimplified[i] = fixDecimals(knlSimplified[i],3);
	}

	// Substitute Node names with their Voltages
	knlSimplified = nodesToVoltagesTex(knlSimplified,realNodesReg);

	// Get Equivalent Impedances and Voltages
	let equivBranchesR = branches.map(branch => branch.equivImpedance);
	let equivBranchesV = branches.map(branch => branch.equivVoltPs);
	let equivEndNodes = {
		startNodes : branches.map(branch => branch.startNode),
		endNodes   : branches.map(branch => branch.endNode)
	};

	// Debug JSON Output
	var circuitFrequency = { value: circuitAnalData.frequency.value, mult: circuitAnalData.frequency.mult }
	var componentsObj = { resistors: resistors, coils: coils, capacitors: capacitors, dcVoltPs: dcVoltPs, dcAmpsPs: dcAmpsPs, acVoltPs: acVoltPs, acAmpsPs: acAmpsPs, isolatedVPS: isolatedPS };
	var probesObj = { ammeters: ampsMeters, voltmeters: voltMeters };
	var analysisObj = {
		chosenMeshes: [],
		circuitFreq: circuitFrequency,
		currents: currents,
		isolatedPs: isolatedPsReg,
		supernodes: {
			_01_data: supernodes,
			_02_floatingSnInfo: {
				_01_endPoints: superNodesEndPointsReg,
				_02_fullVoltRelat: superNodeFloatingVoltRelationReg,
				_03_filteredVoltRelat: superNodeFloatingVoltRelation
			}
		},
		bestGndPos: bestSuperNodeGndPos,
		equations: {
			allVariableEq: [],
			_01_equatCnt: {
				_01_nodesCnt: realNodesElem.length,
				_02_isolPsCnt: isolatedPsReg.length,
				_03_calc: 'knlEq = ' + realNodesElem.length + ' - 1 - ' + isolatedPsReg.length,
				_03_equatCnt: knlEquaCnt,
				_04_eqUnknowns: equationUnknowns
			},
			_02_origEquatElem: knlFilteredEquations,
			_03_allKnlEquations: knlEquationsReg,
			_04_substitutions: stepSubstitutionsReg,
			_05_workedEquationElem: knlCurrEquations,
			_06_workedOhmEqSubsElem: knlSystemEquationsReg,
			_07_fullKnlEquatSytem: knlEquations,
			_08_knlEquationsVl: knlEquationsVl,
			_09_substitutions: knlSubstitutions,

		},
		_06_resultsData: {
			_01_orderedCurrents: knlOrderedCurrents,
			_02_simplifiedEqSystem: knlSimplified,
			_03_nodeVoltages:results,
			_04_circuitCurrents: resultsCurr
		}
	};
	var outputJson = {
		components: componentsObj,
		probes: probesObj,
		nodes: nodes,
		branches: branches,
		analysisObj: analysisObj,
		nodeCnt,
	};

	jsonFile.components.isolatedVPS = isolatedPS

	let lang = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	if(lang === 'english') lang = dictionary.english;
	else if(lang === 'português') lang = dictionary.portuguese;



	let knlV1 = knlEquationsVl;
	// Get Equation System Steps
	let step1 = outStep1(knlOrderedCurrents.original);
	let step2 = outStep2(knlOrderedCurrents.subs);
	let step3 = outStep3(currents,knlCurrData.second);
	let step4 = outStep4(knlEquations,realNodesReg);
	let step5 = outStep5(knlV1.splice(0,knlEquations.length),realNodesReg);
	let step6 = outStep6(supernodes,equationUnknowns);



	// Get Results
	let supernodesOutput = outSupernodes(supernodes, inOrderEquations, knlV1);
	let currentsInfoOutput = outCurrentsInfo(currents, branches);
	let equivImpOutput = outEqImpedances(equivBranchesR,equivBranchesV,equivEndNodes);
	let equationSystemOutput = outEquationSystem(knlSimplified, step1.first, step2.first, step3.first, step4.first, step5.first, step6.first);
	let resultsOutput = outResults(results, resultsCurr, lang)

	//html
	$('#fundamentalVars').html(outCircuitFundamentals(branches.length, nodeCnt, isolatedPsReg.length));
	$('#supernodes').html(supernodesOutput.first);
	$('#KNLEquations').html(knlCurrData.first);
	$('#circuitInfo').html(outCircuitInfo(circuitAnalData.frequency,acAmpsPs.length+dcAmpsPs.length,ampsMeters.length,currents.length));
	$('#currentsInfo').html(currentsInfoOutput.first);
	$('#eqImpedances').html(equivImpOutput.first);
	$('#eqSys').html(equationSystemOutput.first);
	$('#resultsVoltages').html(resultsOutput.first);
	$('#buttonShowAll').html(outShowAllBtn(supernodesOutput.second));



	// Turn the viz. on
	$("#contResults").show();
	$("#loadpage").fadeOut(1000);
	$("#results").show();
	$('#results-modal').modal('show');

	// Toggle plus minus icon on show hide of collapse element
	for(let i = 0; i<7; i++){
		$( "#btn-"+i ).click(function() {
			$(this).find("i").toggleClass("fas fa-plus fas fa-minus");
		});
	}

	$( "#showALL").click(function() {
		for(let i = 0; i<7; i++){
			$("#btn-"+i).children('.fa-minus, .fa-plus').toggleClass("fas fa-minus fas fa-plus");
		}
	});

	// Insert circuit image if available
	if (fileContents[0]) {
		let htmlstring = '<div class="container mt-3"><div class="row bg-light rounded text-dark  p-2">';
		htmlstring += '<h5 class="ml-3" data-translate="_circuitImage"></h5></div></div>';
		htmlstring += '<div class="container mt-2 mb-2 text-center"><img id = "circuitImage" style="max-width: 700px;width:100%;" src='+fileContents[0]+'></div>';
		$('#circuitImage').html(htmlstring);
		$('#circuitImage').show();
	}
	else
		$('#circuitImage').hide();




	/**********************Tex Variables**********************/
	let currentsInfoOutputTex = outCurrentsInfoTex(currents, branches);
	let supernodesOutputTex= outSupernodesTex(supernodes, inOrderEquations, knlV1);
	let equivImpOutputTex = outEqImpedancesTex(equivBranchesR,equivBranchesV,equivEndNodes);
	let equationSystemOutputTex = outEquationSystemTex(knlSimplified, step1.first, step2.first, step3.first, step4.first, step5.first, step6.first);
	let resultsOutputTex = outResultsTex(results, resultsCurr, lang)
	let knlCurrDataTex = outCurrentsKNLTex(knlCurrEquations,supernodes);
	let canvasObjects = createCanvasCurrents(knlCurrData.second);

	let outputTex = {
		supernodes:supernodes,
		nodeCnt: nodeCnt,
		branches: branches,
		acAmpsPs: acAmpsPs,
		dcAmpsPs: dcAmpsPs,
		ampsMeters: ampsMeters,
		currents: currents,
		circuitAnalData: circuitAnalData,
		nodes: nodes,
		isolatedPsReg: isolatedPsReg,
		knlCurrData: knlCurrData,
		step1: step1,
		step2: step2,
		step3: step3,
		step4: step4,
		step5: step5,
		step6: step6,
		supernodesOutputTex: supernodesOutputTex,
		currentsInfoOutputTex: currentsInfoOutputTex,
		equivImpOutputTex: equivImpOutputTex,
		equationSystemOutputTex: equationSystemOutputTex,
		knlCurrDataTex: knlCurrDataTex,
		resultsOutputTex: resultsOutputTex,
		canvasObjects: canvasObjects,
		jsonFile: jsonFile,
		lang: lang,

	}



	output(outputTex);


	// Refresh fileContents
	document.getElementById("fileInput").value = "";

	// Update Dictionary Language
	let language = document.getElementById("lang-sel-txt").innerText.toLowerCase();
	if(language === "english")
		set_lang(dictionary.english);
	else
		set_lang(dictionary.portuguese);
}



