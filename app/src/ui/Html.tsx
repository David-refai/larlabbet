/* trusted markup written by the app itself (lesson icons, the owl): never user text */
export const Html = ({html}: {html: string}) => <span style={{display: "contents"}} dangerouslySetInnerHTML={{__html: html}} />;
