import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IDiagram } from '../interfaces/diagram';
import { ElementsDefinition, StylesheetJson } from 'cytoscape';


@Injectable({
  providedIn: 'root',
})
export class DiagramService {

  private mockStyles: StylesheetJson = [
    {
      selector: 'node[type = "server"]', // Sélecteur pour les nœuds avec type: server
      style: {
        'background-color': '#1abc9c',
        'shape': 'rectangle',
        'label': 'data(label)',
        'text-valign': 'center',
        'width': '80px',
        'height': '40px'
      },
    },
    {
      selector: 'node[type = "database"]',
      style: {
        'background-color': '#3498db',
        'shape': 'round-tag', // Une forme plus spécifique
        'label': 'data(label)'
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      },
    },
  ];

  // --- 2. Définition des Éléments (Nœuds et Arêtes) ---
  private mockElements: ElementsDefinition = {
    nodes: [
      {
        data: {
          id: 'A',
          label: 'Web Server',
          type: 'server', // Utilisé pour le sélecteur de style
          // 💡 Métadonnées spécifiques (pour la modal)
          metadatas: { 
            ip: '192.168.1.10', 
            status: 'Online',
             secret: '********' // Simule des données masquées par le serveur (droit Django)
          }
        },
        position: { x: 100, y: 100 } // Position fixe lors du chargement
      },
      {
        data: {
          id: 'B',
          label: 'Database',
          type: 'database',
          // 💡 Métadonnées spécifiques (pour la modal)
          metadatas: { 
            version: 'MySQL 8.0', 
            port: 3306 
          }
        },
        position: { x: 300, y: 150 } // Position fixe lors du chargement
      },
    ],
    edges: [
      {
        data: {
          id: 'edgeAB',
          source: 'A',
          target: 'B',
          metadatas: { 
            protocol: 'JDBC', 
            latency: '5ms' 
          }
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
