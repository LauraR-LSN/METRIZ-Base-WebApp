// La Société Nouvelle

// Modules
import { jsPDF } from 'jspdf';
import { printValue } from '../utils/Utils';

// Libraries
import metaIndics from '/lib/indics';

export function exportStatementPDF(data) 
{
  const doc = writeStatementPDF(data);

  // Export
  let today = new Date();
  doc.save("declaration_"+data.siren+"-"+String(today.getDate()).padStart(2,'0')+String(today.getMonth()+1).padStart(2,'0')+today.getFullYear()+".pdf");
}

export function getBinaryPDF(data) 
{
  const doc = writeStatementPDF(data);
  const binaryPDF = doc.output('datauristring');

  // Export
  return binaryPDF;
}

const writeStatementPDF = (data) =>
{
  const doc = new jsPDF();
  let today = new Date();

  let notes = [];

  // 
  doc.setFont("Calibri");
  let y = 10;

  // HEADER
  doc.setFontSize(16);
  doc.setFont("Calibri","bold");
  doc.text("DECLARATION - EMPREINTE SOCIETALE",10,y);

  doc.setFont("Calibri","normal");
  doc.setFontSize(10);
  y+=10;
  doc.text("Unité légale : "+data.siren,10,y); 
  y+=6;
  doc.text("Dénomination : "+(data.denomination || "").toUpperCase(),10,y); 
  y+=6;
  doc.text("Année : "+data.year,10,y); 

  y+=15;
  doc.setFontSize(11);
  doc.setFont("Calibri","bold");
  doc.text("Données publiées",10,y);
  doc.line(10,y+2,200,y+2);

  /* ----- TABLE ----- */

  let xNote = 145;
  let xValue = 160;
  let xUncertainty = 180;

  // first line table
  y+=15;
  doc.setFontSize(10);
  doc.setFont("Calibri","normal");
  doc.text("Notes",140,y);
  doc.text("Valeur",160,y);
  doc.text("Incertitude",180,y);
  
  doc.line(10,y+2,200,y+2);
  Object.entries(data.socialFootprint).filter(([_,indicator]) => indicator.value != null)
                                      .forEach(([indic,indicator]) => 
  {
    y+=6;
    doc.text(metaIndics[indic].libelle,10,y);

    if (data.comments[indic]) {
      notes.push(data.comments[indic]);
      doc.text(""+notes.length,xNote,y,{align: "center"});
    }
    doc.text(printValue(indicator.value,0)+" ",xValue+7,y,{align: "right"});
    doc.setFontSize(8);
    doc.text(metaIndics[indic].unit,xValue+7,y,{align: "left"});
    doc.text(printValue(indicator.uncertainty,0)+" %",xUncertainty+12,y,{align: "right"});
    doc.setFontSize(10);
  })
  if (Object.entries(data.socialFootprint).filter(([_,indicator]) => indicator.value != null).length == 0) {
    y+=6;
    doc.setFont("Calibri","italic");
    doc.text("Aucune donnée déclarée",105,y,{align: "center"});
    doc.setFont("Calibri","normal");
  }
  doc.line(10,y+2,200,y+2);

  y+=15;
  doc.text("Edité le : "+String(today.getDate()).padStart(2,'0')+"/"+String(today.getMonth()+1).padStart(2,'0')+"/"+today.getFullYear(),10,y); 
  y+=6;
  doc.text("Déclaration faite par : "+(data.declarant || ""),10,y); 

  y+=20;
  doc.setFontSize(11);
  doc.setFont("Calibri","bold");
  doc.text("Informations relatives à la publication",10,y);
  doc.line(10,y+2,200,y+2);
  
  doc.setFontSize(10);
  doc.setFont("Calibri","normal");
  y+=10;
  doc.text("Le coût de la formalité est de "+(data.price || " - ")+" €",10,y)
  y+=6;
  doc.text("Le délai de publication des données est de 7 jours. Un mail de confirmation vous sera envoyé.",10,y)
  y+=6;
  doc.text("Les données sont modifiables sur simple demande via l'adresse admin@lasocietenouvelle.org",10,y)

  // Base de page
  doc.text("La Société Nouvelle - Société immatriculée au RCS de Lille Métropole - 889 182 770",105,280,{align: "center"})

  // Page with notes
  if (notes.length > 0) 
  {
    doc.addPage();
    y = 15;

    // Titre
    doc.setFontSize(14);
    doc.setFont("Calibri","bold");
    doc.text("NOTES",10,y);
    y+=10;

    doc.setFontSize(10);
    doc.setFont("Calibri","normal");
    for (let i = 0; i < notes.length; i++)
    {
      doc.text(""+(i+1),15,y);
      let lignesNote = doc.splitTextToSize(notes[i],170);
      doc.text(lignesNote,20,y);
      y+=lignesNote*6;
    }

    // Base de page
    doc.text("La Société Nouvelle - Société immatriculée au RCS de Lille Métropole - 889 182 770",105,280,{align: "center"})
  }

  // ----- RETURN ----- //
  return doc;
}