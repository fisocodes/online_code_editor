import { Popover } from "evergreen-ui";
import { Menu } from "evergreen-ui";
import { Button } from "evergreen-ui";
import { Position } from "evergreen-ui";
import { CubeIcon } from "evergreen-ui";
import { FolderOpenIcon } from "evergreen-ui";
import { DownloadIcon } from "evergreen-ui";
import { PlayIcon } from "evergreen-ui";
import { CodeIcon } from "evergreen-ui";
import { HelpIcon } from "evergreen-ui";
import { InfoSignIcon } from "evergreen-ui";
import { EraserIcon } from "evergreen-ui";

function MenuBar(props){
    return(
        <>
            <Popover
                position={Position.BOTTOM_LEFT}
                content={
                    <Menu>
                        <Menu.Item icon={CubeIcon}>New</Menu.Item>
                        <Menu.Item icon={FolderOpenIcon}>Open</Menu.Item>
                        <Menu.Item icon={DownloadIcon}>Save</Menu.Item>
                    </Menu>
                }
            >
                <Button appearance="minimal">File</Button>
            </Popover>
            <Popover
                position={Position.BOTTOM_LEFT}
                content={
                    <Menu>
                        <Menu.Item icon={CodeIcon}>Translate</Menu.Item>
                    </Menu>
                }
            >
                <Button appearance="minimal">Translate</Button>
            </Popover>
            <Popover
                position={Position.BOTTOM_LEFT}
                content={
                    <Menu>
                        <Menu.Item icon={PlayIcon}>Run</Menu.Item>
                    </Menu>
                }
            >
                <Button appearance="minimal">Run</Button>
            </Popover>
            <Popover
                position={Position.BOTTOM_LEFT}
                content={
                    <Menu>
                        <Menu.Item icon={HelpIcon}>Guide</Menu.Item>
                        <Menu.Item icon={InfoSignIcon}>About</Menu.Item>
                    </Menu>
                }
            >
                <Button appearance="minimal">Help</Button>
            </Popover>
            <Button id="clearButton" iconBefore={EraserIcon} onClick={props.handleClear}>Clear</Button>
            <Button id="runButton" iconBefore={PlayIcon}>Run</Button>
            <Button id="translateButton" iconBefore={CodeIcon} onClick={props.handleTranslate}>Translate</Button>
        </>
    );
}

export default MenuBar;