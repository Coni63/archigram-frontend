import { ElementDefinition, ElementsDefinition, StylesheetJson } from "cytoscape";

export interface IDiagram {
    elements: ElementsDefinition | ElementDefinition[] | Promise<ElementsDefinition> | Promise<ElementDefinition[]> | undefined,
    styles: StylesheetJson | Promise<StylesheetJson> | undefined
}
