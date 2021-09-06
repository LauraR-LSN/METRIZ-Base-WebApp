import React from 'react';

import { InputNumber } from '../InputNumber';
import { getNewId, printValue } from '../../src/utils/Utils';

import nrgProducts from '../../lib/nrgProducts.json';

/* -------------------------------------------------------- */
/* -------------------- ASSESSMENT GHG -------------------- */
/* -------------------------------------------------------- */

/* [FR] Liste des postes d'émissions :
    - emissions directes de sources fixes [1]
    - emissions directes de sources mobiles [2]
    - emissions directes de procédés hors énergie [3]
    - emissions fugitives [4]
    - emissions de la biomasse (sols et forêts) [5]

   Each item in ghgDetails has the following properties :
    id: id of the item
    idNRG: if of the matching item in nrg details
    fuelCode: code of the energetic product (cf. base nrgProducts)
    type: fossil/biomass (used for distinction between fossil and biomass products)
    assessmentItem : id of the assessment item (1 -> 5)
    consumption: consumption
    consumptionUnit: unit for the consumption value
    uncertainty: uncertainty for the consumption value
    ghgEmissions: greenhouse gas emissions (in kgCO2e)

   Modifications are saved only when validation button is pressed, otherwise it stay in the state
*/

export class AssessmentGHG extends React.Component {

  constructor(props) {
    super(props)
    this.state = 
    {
      // total ghg emissions & uncertainty
      greenhousesGazEmissions: props.session.impactsData.greenhousesGazEmissions,
      greenhousesGazEmissionsUncertainty: props.session.impactsData.greenhousesGazEmissionsUncertainty,
      // details (by products)
      ghgDetails: props.session.impactsData.ghgDetails,
      // adding new product
      newItem1: false,
      newItem2: false
    }
  }

  render() 
  {
    const {netValueAdded} = this.props.session.impactsData;
    const {greenhousesGazEmissions,greenhousesGazEmissionsUncertainty,ghgDetails} = this.state;
    const {newItem1, newItem2} = this.state;

    return (
      <div className="indicator-section-view">
        <div className="view-header">
          <button className="retour"onClick = {() => this.props.onGoBack()}>Retour</button>
          <button className="retour"onClick = {() => this.onSubmit()}>Valider</button>
        </div>

        <div className="group assessment"><h3>Outil de mesure</h3>

          <table>
            <thead>
              <tr><td colSpan="3">Libellé</td><td colSpan="2">Valeur</td><td></td></tr>
            </thead>
            <tbody>
              
              <tr>
                <td colSpan="3">Emissions directes des sources fixes de combustion</td>
                <td className="short right">{printValue(this.getTotalByAssessmentItem("1"),0)}</td>
                <td className="column_unit"><span>&nbsp;kgCO2e</span></td>
                <td className="column_icon"><img className="img" src="/resources/icon_add.jpg" alt="add" 
                  onClick={() => this.addNewLine("1")}/></td>
              </tr>

              {Object.entries(ghgDetails)
                     .filter(([itemId,itemData]) => itemData.assessmentItem=="1")
                     .map(([itemId,itemData]) => 
                <tr key={itemId}>
                  <td className="sub">
                    <select value={itemData.fuelCode}
                            onChange={(event) => this.changeNrgProduct(itemId,event.target.value)}>
                      {Object.entries(nrgProducts)
                              .filter(([key,data]) => data.subCategory=="Usage source fixe")
                              .map(([key,data]) => <option key={itemId+"_"+key} value={key}>{data.label}</option>)}
                    </select></td>
                  <td className="short right">
                    <InputNumber value={itemData.consumption} 
                                 onUpdate={(nextValue) => this.updateFuelConsumption.bind(this)(itemId,nextValue)}/></td>
                  <td>
                    <select onChange={(event) => this.changeIntensityUnit(itemId,event.target.value)} 
                            value={itemData.consumptionUnit}>
                      {Object.entries(nrgProducts[itemData.fuelCode].units)
                             .map(([unit,_]) => <option key={unit} value={unit}>{unit}</option>)}
                    </select></td>
                  <td className="short right">{printValue(itemData.ghgEmissions,0)}</td>
                  <td className="column_unit"><span>&nbsp;kgCO2e</span></td>
                  <td className="column_icon"><img className="img" src="/resources/icon_delete.jpg" onClick={() => this.deleteItem(itemId)} alt="delete"/></td>
                </tr>
              )}

              {newItem1 &&
                <tr>
                  <td className="sub">
                    <select value="0"
                            onChange={(event) => this.addProduct("1",event.target.value)}>
                      <option key="none" value="none">---</option>
                      {Object.entries(nrgProducts)
                             .filter(([key,data]) => data.subCategory=="Usage source fixe")
                             .map(([key,data]) => <option key={key} value={key}>{data.label}</option>)}
                    </select></td>
                </tr>
              }

              <tr>
                <td colSpan="3">Emissions directes des sources mobiles de combustion</td>
                <td className="short right">{printValue(this.getTotalByAssessmentItem("2"),0)}</td>
                <td className="column_unit"><span>&nbsp;kgCO2e</span></td>
                <td className="column_icon"><img className="img" src="/resources/icon_add.jpg" onClick={() => this.addNewLine("2")} alt="add"/></td>
              </tr>

              {Object.entries(ghgDetails)
                     .filter(([itemId,itemData]) => itemData.assessmentItem=="2")
                     .map(([itemId,itemData]) => 
                <tr key={itemId}>
                  <td className="sub">
                    <select value={itemData.fuelCode}
                            onChange={(event) => this.changeNrgProduct(itemId,event.target.value)}>
                      {Object.entries(nrgProducts)
                             .filter(([key,data]) => data.subCategory=="Usage sources mobiles")
                             .map(([key,data]) => <option key={itemId+"_"+key} value={key}>{data.label}</option>)}
                    </select></td>
                  <td className="short right">
                    <InputNumber value={itemData.consumption} 
                                 onUpdate={(nextValue) => this.updateFuelConsumption.bind(this)(itemId,nextValue)}/></td>
                  <td>
                    <select value={itemData.consumptionUnit}
                            onChange={(event) => this.changeIntensityUnit(itemId,event.target.value)}>
                      {Object.entries(nrgProducts[itemData.fuelCode].units)
                             .map(([unit,_]) => <option key={unit} value={unit}>{unit}</option>)}
                    </select></td>
                  <td className="short right">{printValue(itemData.ghgEmissions,0)}</td>
                  <td className="column_unit"><span>&nbsp;kgCO2e</span></td>
                  <td className="column_icon"><img className="img" src="/resources/icon_delete.jpg" onClick={() => this.deleteItem(itemId)} alt="delete"/></td>
                </tr>
              )}

              {newItem2 &&
                <tr>
                  <td className="sub">
                    <select value="0"
                            onChange={(event) => this.addProduct("2",event.target.value)}>
                      <option key="none" value="none">---</option>
                      {Object.entries(nrgProducts)
                             .filter(([key,data]) => data.subCategory=="Usage sources mobiles")
                             .map(([key,data]) => <option key={key} value={key}>{data.label}</option>)}
                    </select></td>
                </tr>
              }

              <tr>
                <td colSpan="3">Emissions directes des procédés (hors énergie)</td>
                <td className="short right">{printValue(this.getTotalByAssessmentItem("3"),0)}</td>
                <td className="column_unit"><span>&nbsp;kgCO2e</span></td>
              </tr>
              
              <tr>
                <td colSpan="3">Emissions directes fugitives</td>
                <td className="short right">{printValue(this.getTotalByAssessmentItem("4"),0)}</td>
                <td className="column_unit"><span>&nbsp;kgCO2e</span></td>
              </tr>
              
              <tr>
                <td colSpan="3">Emissions issues de la biomasse (sols et forêts)</td>
                <td className="short right">{printValue(this.getTotalByAssessmentItem("5"),0)}</td>
                <td className="column_unit"><span>&nbsp;kgCO2e</span></td>
              </tr>

              <tr className="with-top-line">
                <td colSpan="3">Total</td>
                <td className="column_value">{printValue(greenhousesGazEmissions,0)}</td>
                <td className="column_unit">&nbsp;kgCO2e</td></tr>
              <tr>
                <td colSpan="3">Valeur ajoutée nette</td>
                <td className="column_value">{printValue(netValueAdded,0)}</td>
                <td className="">&nbsp;€</td></tr>
              <tr className="with-top-line with-bottom-line">
                <td colSpan="3">Intensité liée à la valeur ajoutée</td>
                <td className="column_value">{printValue(this.getIntensity(netValueAdded,greenhousesGazEmissions),1)}</td>
                <td className="column_unit">&nbsp;gCO2e/€</td></tr>

            </tbody>
          </table>
        </div>
      </div>
    ) 
  }

  addNewLine = (type) => this.setState({newItem1: (type=="1"), newItem2: (type=="2")})

  updateFuelConsumption = (itemId,nextValue) => 
  {
    let item = this.props.session.impactsData.ghgDetails[itemId];
    item.consumption = nextValue;
    item.ghgEmissions = this.getGhgEmissions(item);
    this.updateGhgEmissions();
  }

  addProduct = (assessmentItem,fuelCode) => 
  {
    let ghgDetails = this.props.session.impactsData.ghgDetails;
    const id = getNewId(Object.entries(ghgDetails)
                              .map(([id,item]) => item));
    ghgDetails[id] = {
      id: id,
      fuelCode: fuelCode, 
      consumption: 0.0, 
      consumptionUnit: "GJ", 
      uncertainty: 25.0, 
      ghgEmissions: 0.0,
      assessmentItem: assessmentItem
    }
    this.setState({ghgDetails: ghgDetails, newItem1: false, newItem2: false});
  }

  changeNrgProduct = (itemId,nextFuelCode) =>
  {
    let itemData = this.props.session.impactsData.ghgDetails[itemId];
    itemData.fuelCode = nextFuelCode;
    // check if the unit used is also available for the new product
    if (Object.keys(nrgProducts[nextFuelCode].units)
              .includes(itemData.consumptionUnit)) {
      itemData.ghgEmissions = this.getGhgEmissions(itemData);
    } else {
      itemData = {...itemData, consumption: 0.0, ghgEmissions: 0.0, consumptionUnit: "GJ", uncertainty: 25.0}
    }
    // update total
    this.updateGhgEmissions();
  }

  changeIntensityUnit = (itemId,nextConsumptionUnit) => 
  {
    let itemData = this.props.session.impactsData.ghgDetails[itemId];
    itemData.consumptionUnit = nextConsumptionUnit;
    itemData.ghgEmissions = this.getGhgEmissions(itemData);
    this.updateGhgEmissions();
  }

  deleteItem = (itemId) =>
  {
    delete this.props.session.impactsData.ghgDetails[itemId];
    this.updateGhgEmissions();
  }

  updateGhgEmissions = async () => this.setState({greenhousesGazEmissions: this.getTotalGhgEmissions()})

  onSubmit = async () =>
  {
    let impactsData = this.props.session.impactsData;

    // update ghg data
    impactsData.ghgDetails = this.state.ghgDetails;
    impactsData.greenhousesGazEmissions = this.state.greenhousesGazEmissions;
    impactsData.greenhousesGazEmissionsUncertainty = this.state.greenhousesGazEmissionsUncertainty;
    
    await this.props.session.updateRevenueIndicFootprint("ghg");

    // update nrg data
    // ...details
    Object.entries(impactsData.ghgDetails)
          .filter(([id,data]) => data.fuelCode!=undefined)
          .forEach(([itemId,itemData]) => 
          {
            if (itemData.idNRG==undefined) {
              const id = getNewId(Object.entries(impactsData.nrgDetails)
                                        .map(([id,data]) => data));
              impactsData.nrgDetails[id] = {
                id: id,
                idGHG: itemId,
                fuelCode: itemData.fuelCode,
                consumption: itemData.consumption, 
                consumptionUnit: itemData.consumptionUnit,
                uncertainty: itemData.uncertainty, 
                nrgConsumption: this.getNrgConsumption(itemData),
                type: nrgProducts[itemData.fuelCode].type
              }
            } else {
              impactsData.nrgDetails[itemData.idNRG].fuelCode = itemData.fuelCode;
              impactsData.nrgDetails[itemData.idNRG].consumption = itemData.consumption;
              impactsData.nrgDetails[itemData.idNRG].consumptionUnit = itemData.consumptionUnit;
              impactsData.nrgDetails[itemData.idNRG].uncertainty = itemData.uncertainty;
              impactsData.nrgDetails[itemData.idNRG].nrgConsumption = this.getNrgConsumption(itemData);
            }
          })
    // ...total & uncertainty
    impactsData.energyConsumption = Object.entries(impactsData.nrgDetails)
                                          .map(([key,data]) => data.nrgConsumption)
                                          .reduce((a,b) => a + b,0);
    
    await this.props.session.updateRevenueIndicFootprint("nrg");
  }

  getTotalGhgEmissions()
  {
    const {ghgDetails} = this.state;
    const sum = Object.entries(ghgDetails)
                      .map(([key,data]) => data.ghgEmissions)
                      .reduce((a,b) => a + b,0);
    return sum;
  }

  getTotalByAssessmentItem(type) 
  {
    const ghgDetails = this.props.session.impactsData.ghgDetails;
    //const sum = Object.entries(ghgDetails).filter(([key,data]) => key.charAt(0)==type).map(([key,data]) => data.consumption).reduce((a,b) => a + b,0);
    return 0;
  }

  getGhgEmissions({consumption,consumptionUnit,fuelCode}) 
  {
    switch(consumptionUnit) 
    {
      case "kgCO2e": return consumption;
      case "tCO2e": return consumption*1000;
      default: {
        const coef = nrgProducts[fuelCode].units[consumptionUnit].coefGHG;
        return consumption * coef;
      }
    }
  }

  getTotalNrgConsumption()
  {
    const {nrgDetails} = this.state;
    const sum = Object.entries(nrgDetails)
                      .map(([key,data]) => data.nrgConsumption)
                      .reduce((a,b) => a + b,0);
    return sum;
  }

  getNrgConsumption({consumption,consumptionUnit,fuelCode}) 
  {
    switch(consumptionUnit) 
    {
      case "MJ": return consumption;
      case "kWh": return consumption*3.6;
      default: {
        const coef = nrgProducts[fuelCode].units[consumptionUnit].coefNRG;
        return consumption * coef;
      }
    }
  }

  getIntensity = (netValueAdded,greenhousesGazEmissions) => 
  {
    if (netValueAdded!=null && greenhousesGazEmissions!=null) {return greenhousesGazEmissions*1000/netValueAdded}
    else {return null} 
  }

}