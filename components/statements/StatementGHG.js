// La Société Nouvelle

// React
import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";

// Utils
import { printValue, roundValue, valueOrDefault } from '../../src/utils/Utils';
import { InputNumber } from '../InputNumber';

/* ---------- DECLARATION - INDIC #GHG ---------- */

export class StatementGHG extends React.Component {

  constructor(props) 
  {
    super(props);
    this.state = {
      greenhousesGazEmissions: valueOrDefault(props.impactsData.greenhousesGazEmissions, ""),
      greenhousesGazEmissionsUncertainty: valueOrDefault(props.impactsData.greenhousesGazEmissionsUncertainty, ""),
      info : props.impactsData.comments.ghg || ""
    }
  }

  componentDidUpdate() 
  {
    if (this.state.greenhousesGazEmissions!=this.props.impactsData.greenhousesGazEmissions) {
      this.setState({greenhousesGazEmissions: this.props.impactsData.greenhousesGazEmissions});
    }
    if (this.state.greenhousesGazEmissionsUncertainty!=this.props.impactsData.greenhousesGazEmissionsUncertainty) {
      this.setState({greenhousesGazEmissionsUncertainty: this.props.impactsData.greenhousesGazEmissionsUncertainty});
    }
  }

  render() 
  {
    const {netValueAdded} = this.props.impactsData;
    const {greenhousesGazEmissions,greenhousesGazEmissionsUncertainty,info} = this.state;

    let isValid = greenhousesGazEmissions!=null && netValueAdded!=null;

    return (
      <div className="statement">
                <div className="statement-form">

        <div className="form-group">
          <label>Emissions directes de Gaz à effet de serre - SCOPE 1</label>
          <InputNumber value={roundValue(greenhousesGazEmissions,0)}
                       onUpdate={this.updateGreenhousesGazEmissions} placeholder={"kgCO2e"}/>
          <div className="assessment-button-container">
          </div>
        </div>
        <div className="form-group">
          <label>Incertitude</label>
          <InputNumber value={roundValue(greenhousesGazEmissionsUncertainty,0)}
                       onUpdate={this.updateGreenhousesGazEmissionsUncertainty} 
                       placeholder={"%"}/>
        </div>
        </div>
        <div className="statement-comments">
          <label>Informations complémentaires</label>
          <textarea type="text" spellCheck="false"
                    value={info} 
                    onChange={this.updateInfo}
                    onBlur={this.saveInfo}/>
        </div>
        <div className="statement-validation">
        <button className={"btn btn-primary"} onClick={this.props.toAssessment}>
        <FontAwesomeIcon icon={faCalculator} /> Outil d'évaluation</button>

          <button disabled={!isValid} className={"btn btn-secondary"}
                  onClick={this.onValidate}>Valider</button>
        </div>
      </div>
    ) 
  }

  updateGreenhousesGazEmissions = (input) => 
  {
    this.props.impactsData.setGreenhousesGazEmissions(input);
    this.setState({greenhousesGazEmissionsUncertainty: this.props.impactsData.greenhousesGazEmissionsUncertainty});
    this.props.onUpdate("ghg");
  }

  updateGreenhousesGazEmissionsUncertainty = (input) => 
  {
    this.props.impactsData.greenhousesGazEmissionsUncertainty = input;
    this.props.onUpdate("ghg");
  }
  
  updateInfo = (event) => this.setState({info: event.target.value});
  saveInfo = () => this.props.impactsData.comments.ghg = this.state.info;

  onValidate = () => this.props.onValidate()
}

export const writeStatementGHG = (doc,x,y,impactsData) =>
{
  doc.text("Emissions directes de gaz à effet de serre : "+printValue(impactsData.greenhousesGazEmissions,0)+" kgCO2e +/- "+printValue(impactsData.greenhousesGazEmissionsUncertainty,0)+ " %",x,y);
  // détail si existant
  return y;
}