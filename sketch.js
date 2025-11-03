let data; //dati tabella
let tableRows;

function preload() {

  data = loadTable('dataset.csv', 'csv', 'header');

}

function setup() {

  createCanvas(windowWidth, windowHeight);

  background("#ffea00ff");

  angleMode(DEGREES);

  //griglia
  let outerpadding = 30; //padding intorno glifi per evitare tocchino bordi

  let side = 50; //lunghezza lato contenitore glifi
  let padding = 10; //spazio tra glifi

  let glyphSize = side + padding; //spazio totale che ogni glifo occupa

  let totalWidth = width - outerpadding * 2; //area di disegno totale sottraendo il padding esterno
  let totalHeight = height - outerpadding * 2;

  let totalCols = floor(totalWidth / glyphSize); //calcolo quante righe e colonne entrano in area disponibile
  let totalRows = floor(totalHeight / glyphSize);

  tableRows = data.getRowCount(); //numero righe dati da utilizzare

  //linee tra righe glifi
  for (let row = 1; row < totalRows; row++) { //inizia da row = 1 per saltare prima riga

    let lineY = outerpadding + row * glyphSize - padding / 2; //calcola posizione y linea
                                                              //a metà dello spazio padding tra 2 righe
    stroke("#000000ff");
    line(outerpadding, lineY, width - outerpadding, lineY); //linea orizzontale line(x1, y1, x2, y2)
  }

  // glifi nella griglia
  for (let row = 0; row < totalRows; row++) { //cicli nidificati per disegnare ogni glifo nella griglia
    for (let col = 0; col < totalCols; col++) {
    
      let dataRowIndex = (row * totalCols + col) % tableRows; //quest'operazione calcola numero contenitore glifo
                                                              //row * totalCols calcola numero contenitori prima di riga attuale
                                                              //+ col gli aggiunge colonna glifo attuale, ottenendo posizione glifo attuale
                                                              //operatore modulo (% tableRows) divide posizione glifo attuale per numero righe tabella (tableRows) e restituisce il resto, se posizione glifo attuale supera numero righe disponibili (tableRows), essa ricomincia da riga zero
      let currentRow = data.getRow(dataRowIndex); //riga glifo attuale
      let column0Value = currentRow.getNum('column0');
      let column1Value = currentRow.getNum('column1');
      let column2Value = currentRow.getNum('column2');

      //posizione (x, y) è angolo in alto a sinistra contenitore glifo
      let x = outerpadding + col * glyphSize; //calcola posizione x glifo attuale
      let y = outerpadding + row * glyphSize;

      drawGlyph(x, y, side, column0Value, column1Value, column2Value); //funzione per disegnare glifo
                                                                       //x, y posizione di partenza, lunghezza lato contenitore glifo, dati estratti che definiscono l'aspetto specifico glifo
    }
  }
}

function draw() {
  //draw() vuota, poiché disegno statico
}

function drawGlyph(posX, posY, containerSide, col0Val, col1Val, col2Val) { //argomenti sono parametri per disegnare glifo
                                                                           //lato contenitore glifo (side), dimensione massima glifo, per calcolare diametro cerchio e dimensioni rettangolo
                                                                           //valore column0 per colore cerchio
                                                                           //valore column1 per colore rettangolo
                                                                           //valore column2 per angolo di rotazione rettangolo

  let centerX = posX + containerSide / 2; //calcolo centro contenitore glifo, che è centro del cerchio
                                          //posizione X angolo superiore sinistro contenitore glifo, posizione orizzontale glifo
  let centerY = posY + containerSide / 2; //posizione Y angolo superiore sinistro contenitore glifo, posizione verticale glifo

  let circleDiameter = containerSide / 2;
  let circleRadius = circleDiameter / 2;

  let rectWidth = circleDiameter; //larghezza rettangolo
  let rectHeight = 2 * circleDiameter; //altezza rettangolo

  if (col0Val < 0) { //se valore column0 < 0
    fill("#ffffff"); //cerchio bianco
  } else {
    fill("#000000ff"); //cerchio nero
  }
  stroke(0);

  push(); 

  translate(centerX, centerY); //sposta origine glifo (0,0) a centro contenitore glifo
  rotate(col2Val); //ruota rettangolo di angolo = valore column2

  let rectX = -rectWidth / 2; //centro orizzontale, poiché uso CORNER (disegna da angolo superiore sinistro), angolo superiore sinistro deve essere posizionato a metà larghezza a sinistra origine
  let rectY = -circleRadius; //lato superiore, allineato a metà superiore cerchio

  rectMode(CORNER); //dice interpretare coordinate rettangolo come angolo superiore sinistro rettangolo, non più come suo centro

  if (col1Val % 2 === 0) { //se valore column1 pari
    fill("#ff0000ff"); //rettangolo rosso
  } else {
    fill("#1100ffff"); //rettangolo blu
  }

  rect(rectX, rectY, rectWidth, rectHeight); //disegna da angolo superiore sinistro, poiché c'è rectMode(CORNER)

  pop();

  circle(centerX, centerY, circleDiameter); //cerchio
}

function windowResized() { //funzione quando finestra ridimensionata

  resizeCanvas(windowWidth, windowHeight); //ridimensiona area di disegno, per adattarsi al nuova dimensione finestra.
  setup(); //richiama setup() per ricalcolare griglia e ridisegnare glifi

}