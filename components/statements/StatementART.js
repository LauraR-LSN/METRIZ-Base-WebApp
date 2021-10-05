// La Société Nouvelle

// React
import React from 'react';

// Utils
import { roundValue, valueOrDefault } from '../../src/utils/Utils';
import { InputNumber } from '../InputNumber';

/* ---------- DECLARATION - INDIC #ART ---------- */

/** Component in IndicatorMainTab
 *  Props : 
 *    - impactsData
 *    - onUpdate -> update footprints, update table
 *    - onValidate -> update validations
 *    - toAssessment -> open assessment view (if defined)
 *  Behaviour :
 *    Edit directly impactsData (session) on inputs blur
 *    Redirect to assessment tool (if defined)
 *    Update footprints on validation
 *  State :
 *    inputs
 */

export class StatementART extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      craftedProduction: valueOrDefault(props.impactsData.craftedProduction, ""),
    }
  }

  componentDidUpdate() 
  {
    if (this.state.craftedProduction!=this.props.impactsData.craftedProduction) {
      this.setState({craftedProduction: this.props.impactsData.craftedProduction});
    }
  }

  render()
  {
    const {isValueAddedCrafted,netValueAdded} = this.props.impactsData;
    const {craftedProduction} = this.state;

    let isValid = craftedProduction!=null && netValueAdded!=null;

    return (
      <div className="statement">
        <div className="statement-item">
          <label>L'entreprise est-elle une entreprise artisanale ?</label>
          <div className="input-radio">
            <input type="radio" id="isValueAddedCrafetd"
                   value="true"
                   checked={isValueAddedCrafted === true}
                   onChange={this.onIsValueAddedCraftedChange}/>
            <label>Oui</label>
          </div>
          <div className="input-radio">
            <input type="radio" id="isValueAddedCrafetd"
                   value="null"
                   checked={isValueAddedCrafted === null && craftedProduction !== ""}
                   onChange={this.onIsValueAddedCraftedChange}/>
            <label>Partiellement</label>
          </div>
          <div className="input-radio">
            <input type="radio" id="isValueAddedCrafetd"
                   value="false"
                   checked={isValueAddedCrafted === false}
                   onChange={this.onIsValueAddedCraftedChange}/>
            <label>Non</label>
          </div>
        </div>
        <div className="statement-item">
          <label>Part de la valeur ajoutée artisanale</label>
          <InputNumber value={roundValue(craftedProduction,0)}
                       onUpdate={this.updateCraftedProduction.bind(this)}
                       disabled={isValueAddedCrafted!=null}/>
          <span>&nbsp;€</span>
        </div>
        <div className="statement-validation">
          <button disabled={!isValid}
                  onClick={this.onValidate}>Valider</button>
        </div>
      </div>
    ) 
  }

  onIsValueAddedCraftedChange = (event) => 
  {
    let radioValue = event.target.value;
    switch(radioValue) {
      case "true": 
        this.props.impactsData.isValueAddedCrafted = true;
        this.props.impactsData.craftedProduction = this.props.impactsData.netValueAdded;
        break;
      case "null": 
        this.props.impactsData.isValueAddedCrafted = null;
        this.props.impactsData.craftedProduction = null;
        break;
      case "false": 
        this.props.impactsData.isValueAddedCrafted = false;
        this.props.impactsData.craftedProduction = 0; 
        break;
    }
    this.setState({craftedProduction: this.props.impactsData.craftedProduction});
    this.props.onUpdate("art");
  }

  updateCraftedProduction = (input) => 
  {
    this.props.impactsData.craftedProduction = input;
    this.setState({craftedProduction: this.props.impactsData.craftedProduction});
    this.props.onUpdate("art");
  }

  onValidate = () => this.props.onValidate()

}