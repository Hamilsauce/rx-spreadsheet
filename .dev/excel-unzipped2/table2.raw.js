export const table2 = new DOMParser().parseFromString(`
<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="xr xr3" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" id="3" xr:uid="{190FCB6E-F0D8-1540-98F2-5AEABB787E2F}" name="Table24" displayName="Table24" ref="A10:C13" totalsRowShown="0">
  <autoFilter ref="A10:C13" xr:uid="{190FCB6E-F0D8-1540-98F2-5AEABB787E2F}" />
  <tableColumns count="3">
    <tableColumn id="1" xr3:uid="{C5080373-CA75-6348-9853-61C6D0A2D40F}" name="first">
      <calculatedColumnFormula>
        A2
      </calculatedColumnFormula>
    </tableColumn>
    <tableColumn id="2" xr3:uid="{58D8F3C2-AA2D-0A40-AE87-F9D5CA39117D}" name="second">
      <calculatedColumnFormula>
        B2
      </calculatedColumnFormula>
    </tableColumn>
    <tableColumn id="3" xr3:uid="{69ECD5D6-F008-C943-ACD3-427560561DB3}" name="result">
      <calculatedColumnFormula>
        SUM(Table24[[#This Row],[first]:[second]])
      </calculatedColumnFormula>
    </tableColumn>
  </tableColumns>
  <tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0" />
</table>`, 'application/xml').documentElement;
