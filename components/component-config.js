// import { Component } from './Component.js';
// import { Workbook } from './Workbook.js';
// import { Worksheet } from './Worksheet.js';
// import { Application } from './Application.js';
import {Application, Topbar, Workbook, WorksheetTabs,Worksheet} from './index.js';
export const ComponentConfig = () => ({
  get application() { return Application },
  get workbook() { return Workbook },
  get worksheet() { return Worksheet },
  get topbar() { return Topbar },
  get 'worksheet-tabs'() { return WorksheetTabs },
})
