# Scenarios

![Component Diagram](https://www.plantuml.com/plantuml/proxy?cache=no&src=https://github.com/peterhnm/vscode.hexagonagonal-example/blob/main/docs/Architecture.puml?raw=true)

## Scenario 1: User opens a `.hexagon` file.

1. *activate()* within **_extension.ts_** is called
2. IoC-Container registers the classes we use for dependency injection
3. Register the *CustomTextEditor*
4. Register the command for toggling the text editor
5. For every `.hexagon` file:
    1. The *CustomTextEditor.resolveCustomTextEditor()* method is called
    2. *CustomTextEditor* calls *out/WebviewAdapter* and *out/DocumentAdapter* to set the current webview and the
       corresponding `.hexagon` file as the **active** ones
    3. Create a new *in/DocumentAdapter* and *in/WebviewAdapter*

## Scenario 2: User uses the custom editor to make changes to the file.

1. The *in/WebviewAdapter* calls *SyncDocumentService.sync()*
2. The *SyncDocumentService* calls the *out/DocumentAdapter*
3. The *out/DocumentAdapter* performs validation and uses the **currently active** document to write the changes to it

## Scenario 3: User opens the text editor.

1. The *in/TextEditorAdapter* calls *TextEditorService.toggle()*
2. The *TextEditorService* calls *out/TextEditorAdapter*
    * To load all open text editors
    * To open or close the text editor for the **currently active** `.hexagon` file

## Scenario 4: User uses the text editor to make changes to the file.

1. The *in/DocumentAdapter* calls *SyncWebviewService.sync()*
2. The *SyncWebviewService* calls the *out/WebviewAdapter*
3. The *out/WebviewAdapter* performs validation and uses the **currently active** webview to post a message to it

## Scenario 5: User switches the tab to another

### ... file and closes the text editor.

1. The *in/TextEditorAdapter* calls *TextEditorService.close()* with all closed `.hexagon` files
2. The *TextEditorService* calls *out/TextEditorAdapter*
    * To load all open text editors
    * To close the text editor for the `.hexagon` file(s)

### ... `.hexagon` file and opens the text editor.

1. *CustomTextEditor* calls *out/WebviewAdapter* and *out/DocumentAdapter* to set the new **active** webview and
   document
2. The *in/TextEditorAdapter* calls *TextEditorService.toggle()*
3. The *TextEditorService* calls *out/TextEditorAdapter*
    * To load all open text editors
    * To open or close the text editor for the **currently active** `.hexagon` file
