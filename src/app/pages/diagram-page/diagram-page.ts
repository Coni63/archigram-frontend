import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DiagramService } from '../../services/diagram-service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import cytoscape from 'cytoscape';
import { IDiagram } from '../../interfaces/diagram';
import { CommonModule } from '@angular/common';

type CyInstance = cytoscape.Core;

@Component({
  selector: 'app-diagram-page',
  imports: [CommonModule, NzModalModule],
  templateUrl: './diagram-page.html',
  styleUrl: './diagram-page.scss',
})
export class DiagramPage implements OnInit {
  diagramService = inject(DiagramService)
  private cy: CyInstance | undefined;
  private cdr = inject(ChangeDetectorRef);
  isVisible = false;
  currentMetadatas: any = {}; // Ajout pour le contenu de la modal
  currentTitle: string = ''; // Ajout pour le titre de la modal


  ngOnInit(): void {
      this.diagramService.getGraph("abc").subscribe((data: IDiagram) => {
        const containerElement = document.getElementById('cy');
        if (containerElement) {
          const cy = cytoscape({ 
            container: containerElement,
            elements: data.elements,
            style: data.styles,
            layout: { name: 'preset' }
          });

          this.cy = cy; 

          this.setupInteractions(cy);
        } else {
          console.error("L'élément #cy n'a pas été trouvé dans le DOM.");
        }
      });
    }

  saveGraph(): void {
    if (this.cy) {
      // Exporte l'état actuel du graphe (nœuds, positions, edges, métadonnées)
      const updatedGraphJson = this.cy.json(); 

      this.diagramService.saveGraph(updatedGraphJson as IDiagram ,"abc")
        .subscribe(
          response => console.log('Graphe sauvegardé!', response),
          error => console.error('Erreur de sauvegarde', error)
        );
    }
  }

  setupInteractions(cy: CyInstance): void {
      cy.on('dbltap', 'node', this.handleNodeDoubleClick.bind(this));
  }

  showModal(): void {
    console.log("dsfsf");
    this.isVisible = true;
    this.cdr.detectChanges();
    console.log(this.isVisible);
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.cdr.detectChanges();
    console.log(this.isVisible);
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.cdr.detectChanges();
    console.log(this.isVisible);
  }

  private handleNodeDoubleClick(evt: any): void {
      const node = evt.target;
      
      // Mettez à jour les propriétés de la classe pour la modal
      this.currentMetadatas = node.data('metadatas');
      this.currentTitle = `Métadonnées du Nœud : ${node.data('label')}`;
      
      this.showModal();

      console.log(`Modal affichée pour : ${this.currentTitle}`);
      console.log(this.currentMetadatas);
  }
}
