import { ChangeDetectorRef, Component, inject, OnInit, AfterViewInit, NgZone } from '@angular/core';
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
export class DiagramPage implements OnInit, AfterViewInit {
  diagramService = inject(DiagramService)
  private cy: CyInstance | undefined;
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  isVisible = false;
  currentMetadatas: any = {}; // Ajout pour le contenu de la modal
  currentTitle: string = ''; // Ajout pour le titre de la modal
  private draggedNodeType: string | null = null; 
  

  availableNodeTypes = [
    { type: 'docker-linux', label: 'Docker on Linux', color: '#2496ED' },
    { type: 'kafka', label: 'Kafka', color: '#231F20' },
    { type: 'k8s-docker', label: 'Docker on Kubernetes', color: '#326CE5' },
    { type: 'oracle-db', label: 'Oracle DB', color: '#F80000' },
    { type: 'postgres-db', label: 'Postgres DB', color: '#0064a5' },
    { type: 'mq-series', label: 'MQ Series', color: '#6A5ACD' },
    { type: 'external-ms', label: 'Microservices externes', color: '#95A5A6' },
    { type: 'firewall', label: 'Firewall', color: '#E74C3C' }
  ];

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

  ngAfterViewInit(): void {
    // Attendre un peu que Cytoscape soit initialisé
    setTimeout(() => {
      this.setupDragAndDrop();
    }, 100);
  }


  // Stocke temporairement le type de nœud en cours de drag

  private setupDragAndDrop(): void {
    const cyContainer = document.getElementById('cy');
    const sidebarNodes = document.querySelectorAll('.draggable-node');

    if (!cyContainer || sidebarNodes.length === 0) {
      console.warn('Container ou nodes draggables non trouvés');
      return;
    }

    // Configurer dragstart pour chaque élément de la sidebar
    sidebarNodes.forEach((node) => {
      node.addEventListener('dragstart', (e: Event) => {
        const dragEvent = e as DragEvent;
        const nodeType = (node as HTMLElement).dataset['nodeType'];
        
        if (nodeType && dragEvent.dataTransfer) {
          this.draggedNodeType = nodeType;
          dragEvent.dataTransfer.effectAllowed = 'copy';
          dragEvent.dataTransfer.setData('text/plain', nodeType);
        }
      });

      node.addEventListener('dragend', () => {
        this.draggedNodeType = null;
      });
    });

    // Événements sur le conteneur Cytoscape
    cyContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    });

    cyContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      
      if (!this.cy || !this.draggedNodeType) return;

      // 1. Position relative au container
      const cyOffset = cyContainer.getBoundingClientRect();
      const renderedX = e.clientX - cyOffset.left;
      const renderedY = e.clientY - cyOffset.top;
      
      // 2. 🔑 CORRECTION : Conversion des coordonnées écran vers graphe
      // Utiliser pan() et zoom() pour convertir manuellement
      const pan = this.cy.pan();
      const zoom = this.cy.zoom();
      
      const graphPosition = {
        x: (renderedX - pan.x) / zoom,
        y: (renderedY - pan.y) / zoom
      };
      
      // 3. Ajouter le nœud (dans la zone Angular pour la détection de changement)
      this.ngZone.run(() => {
        this.addNodeToGraph(graphPosition, this.draggedNodeType!);
        this.draggedNodeType = null;
      });
    });
  }
    
  // Méthode pour ajouter le nœud
  private addNodeToGraph(position: { x: number, y: number }, type: string): void {
    if (!this.cy) return;

    const newNodeId = `n-${Date.now()}`;
    const nodeConfig = this.availableNodeTypes.find(n => n.type === type);
    const newNodeLabel = nodeConfig?.label || 'Nouveau Composant';
    
    this.cy.add({
      group: 'nodes',
      data: {
        id: newNodeId,
        label: newNodeLabel,
        type: type,
        metadatas: {}
      },
      position: position
    });
    
    console.log(`Nœud ajouté: ${newNodeLabel} à la position`, position);
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
      cy.on('dbltap', 'edge', this.handleNodeDoubleClick.bind(this));
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
