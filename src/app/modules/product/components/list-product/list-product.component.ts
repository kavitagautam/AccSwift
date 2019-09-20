import { Component, OnInit } from '@angular/core';
const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  public data1: any[] = [{
    text: 'My Documents',
    items: [
        {
            text: 'Kendo UI Project',
            items: [
                { text: 'about.html' ,items:[{text: "this is the next one"}] },
                { text: 'index.html' ,items:[{text: "this is the next one"}] },
                { text: 'logo.png' ,items:[{text: "this is the next one"}] }
            ]
        },
        {
            text: 'New Web Site',
            items: [
                { text: 'mockup.jpg' },
                { text: 'Research.pdf' }
            ]
        },
        {
            text: 'Reports',
            items: [
                { text: 'February.pdf' },
                { text: 'March.pdf' },
                { text: 'April.pdf' }
            ]
        }
    ]
}];

public iconClass({ text, items }: any): any {
    return {
        'k-i-file-pdf': is(text, 'pdf'),
        'k-i-folder': items !== undefined,
        'k-i-html': is(text, 'html'),
        'k-i-image': is(text, 'jpg|png'),
        'k-icon': true
    };
}
  public data: any[] = [
    {
        text: 'Furniture', items: [
            { text: 'Tables & Chairs' },
            { text: 'Sofas' },
            { text: 'Occasional Furniture' }
        ]
    },
    {
        text: 'Decor', items: [
            { text: 'Bed Linen' },
            { text: 'Curtains & Blinds' },
            { text: 'Carpets' }
        ]
    }
];

}
