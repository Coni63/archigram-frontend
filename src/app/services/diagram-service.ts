import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IDiagram } from '../interfaces/diagram';
import { ElementsDefinition, StylesheetJson } from 'cytoscape';


@Injectable({
  providedIn: 'root',
})
export class DiagramService {

  // https://manual.cytoscape.org/en/stable/Styles.html#list-of-node-edge-network-and-column-properties

  private mockStyles: StylesheetJson = [
    // Style de base (déjà défini)
    
    // 💡 Docker on Linux
    {
        selector: 'node[type = "docker-linux"]',
        style: {
            'background-color': '#2496ED', // Bleu Docker
            // 'shape': 'roundrectangle',
            'background-image': 'url(/assets/icons/docker.svg)', // Assurez-vous d'avoir l'icône
            'background-fit': 'contain',
            // 'width': '50px',
            // 'height': '50px'
        }
    },
    // 💡 Kafka
    {
        selector: 'node[type = "kafka"]',
        style: {
            'background-color': '#CCAAEE',
            'shape': 'ellipse',
            'background-image': 'url(/assets/icons/kafka.svg)',
            'background-fit': 'contain',
            'width': '60px',
            'height': '40px'
        }
    },
    // 💡 Oracle DB
    {
        selector: 'node[type = "oracle-db"]',
        style: {
            'background-color': '#F80000',
            'shape': 'barrel', // Forme de base de données
            'background-image': 'url(/assets/icons/oracle.svg)',
            'background-fit': 'contain',
            // 'width': '80px',
            // 'height': '50px'
        }
    },
    {
        selector: 'node[type = "postgres-db"]',
        style: {
            // 'background-color': '#F80000',
            'shape': 'barrel', // Forme de base de données
            'background-image': 'url(/assets/icons/postgres.svg)',
            'background-fit': 'contain',
            // 'width': '80px',
            // 'height': '50px'
        }
    },
    // 💡 Firewall
    {
        selector: 'node[type = "firewall"]',
        style: {
            'background-color': '#E74C3C',
            'shape': 'cut-rectangle', // Forme représentant une barrière
            'background-image': 'url(/assets/icons/firewall.svg)',
            'width': '90px',
            'height': '35px'
        }
    },
    // Ajoutez ici les styles pour k8s-docker, postgres-db, mq-series, external-ms
    // ...
    {
        selector: 'edge[type = "kafka-producer"]',
        style: {
            'line-style': 'dotted', // Forme représentant une barrière
            'line-color': '#E74C3C',
            'curve-style': 'straight', 
            'target-arrow-shape': 'triangle-cross',
        }
    },
    {
        selector: 'edge[type = "kafka-consumer"]',
        style: {
            'line-style': 'dotted', // Forme représentant une barrière
            'line-color': '#E74C3C',
            'line-cap': 'butt',
            'curve-style': 'straight', 
            'target-arrow-shape': 'triangle-cross',
            'source-arrow-shape': 'circle'
        }
    },

  ];

  // --- 2. Définition des Éléments (Nœuds et Arêtes) ---
  private mockElements: ElementsDefinition = {
    nodes: [
        {
            data: {
                id: 'S01',
                label: 'Service Client',
                type: 'docker-linux', // 👈 Nouveau Type
                metadatas: { version: 'v2.1', host: 'serveur-prod' }
            },
            position: { x: 150, y: 0 }
        },
        {
            data: {
                id: 'K01',
                label: 'Topic Commandes',
                type: 'kafka', // 👈 Nouveau Type
                metadatas: { cluster: 'prod-east', topics: 5 }
            },
            position: { x: 300, y: 0 }
        },
        {
            data: {
                id: 'S02',
                label: 'Service Client',
                type: 'docker-linux', // 👈 Nouveau Type
                metadatas: { version: 'v2.1', host: 'serveur-prod' }
            },
            position: { x: 300, y: 150 }
        },
        {
            data: {
                id: 'DB01',
                label: 'Catalogue',
                type: 'oracle-db', // 👈 Nouveau Type
                metadatas: { license: 'Enterprise', size: '2TB' }
            },
            position: { x: 450, y: 150 }
        },
        {
            data: {
                id: 'DB02',
                label: 'Catalogue',
                type: 'postgres-db', // 👈 Nouveau Type
                metadatas: { license: 'Enterprise', size: '2TB' }
            },
            position: { x: 0, y: 0 }
        },
        // Ajoutez d'autres nœuds avec les types: 'k8s-docker', 'postgres-db', etc.
    ],
    edges: [
        {
            data: {
                source: 'DB02',
                target: 'S01',
                label: 'Production',
                metadatas: { license: 'Enterprise', size: '2TB' }
            }
        },
        {
            data: {
                source: 'S01',
                target: 'K01',
                label: 'Production',
                type: 'kafka-producer',
                metadatas: { license: 'Enterprise', size: '2TB' }
            }
        },
        {
            data: {
                source: 'K01',
                target: 'S02',
                label: 'Production',
                type: 'kafka-consumer',
                metadatas: { license: 'Enterprise', size: '2TB' }
            }
        },
        {
            data: {
                source: 'S02',
                target: 'DB01',
                label: 'Consommation',
                metadatas: { license: 'Enterprise', size: '2TB' }
            }
        },
        {
            data: {
                source: 'S02',
                target: 'DB02',
                label: 'Consommation',
                metadatas: { license: 'Enterprise', size: '2TB' }
            }
        }
    ]
  };

  getGraph(project: string): Observable<IDiagram> {
    return of({
      elements: this.mockElements,
      styles: this.mockStyles
    })
  }

  saveGraph(data: IDiagram, project: string): Observable<IDiagram> {
    return of({
      elements: [],
      styles: []
    })
  }
}
