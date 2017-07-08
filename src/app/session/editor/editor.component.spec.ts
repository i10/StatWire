import { EditorComponent } from './editor.component';
import { ParameterList } from '../../model/parameter-list';

describe('EditorComponent', () => {
  let editorComponent: EditorComponent;
  beforeEach(() => {
    editorComponent = new EditorComponent();
  });

  it('#parseParameters should return empty array if no parameters are found', () => {
    const testCode = 'function()';
    const actualParameterNames = editorComponent['parseParameters'](testCode, editorComponent['functionHeaderPattern']);
    expect(actualParameterNames).toEqual([]);
  });

  it('#getInputList should parse valid inputs', () => {
    const testCode = `function(first, second, third){
  return(first + second + third)
}`;
    const actualInputList = editorComponent['getInputList'](testCode);
    const expectedInputList = new ParameterList();
    expectedInputList.addParameter('first')
      .addParameter('second')
      .addParameter('third');
    expect(actualInputList).toEqual(expectedInputList);
  });

  it('#getInputList should return empty ParameterList when no inputs are given', () => {
    const testCode = `function(){
  return(first, second, third)
}`;
    const actualInputList = editorComponent['getInputList'](testCode);
    const expectedInputList = new ParameterList();
    expect(actualInputList).toEqual(expectedInputList);
  });

  it('#getOutputList should parse valid outputs', () => {
    const testCode = `function(ignoreMe){
  first <- 1
  second <- 'string'
  third <- ignoreMe + 1
  return(first, second, third)
}`;
    const actualOutputList = editorComponent['getOutputList'](testCode);
    const expectedOutputList = new ParameterList();
    expectedOutputList.addParameter('first')
      .addParameter('second')
      .addParameter('third');
    expect(actualOutputList).toEqual(expectedOutputList);
  });

  it('#getOutputList should return empty ParameterList when no outputs are given', () => {
    const testCode = `function(first, second, third){
  return()
}`;
    const actualOutputList = editorComponent['getOutputList'](testCode);
    const expectedOutputList = new ParameterList();
    expect(actualOutputList).toEqual(expectedOutputList);
  })
});
