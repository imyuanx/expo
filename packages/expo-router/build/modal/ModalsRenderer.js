"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalsRenderer = void 0;
const non_secure_1 = require("nanoid/non-secure");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_screens_1 = require("react-native-screens");
const Portal_1 = require("./Portal");
const utils_1 = require("./utils");
const ModalsRenderer = ({ children, modalConfigs, onDismissed, onShow, }) => {
    const rootId = (0, react_1.useRef)((0, non_secure_1.nanoid)());
    return (<react_native_screens_1.ScreenStack style={styles.stackContainer}>
      <react_native_screens_1.ScreenStackItem screenId={rootId.current} activityState={2} style={react_native_1.StyleSheet.absoluteFill} headerConfig={{
            hidden: true,
        }}>
        {children}
      </react_native_screens_1.ScreenStackItem>
      {modalConfigs.map((config) => (<NativeModal key={config.uniqueId} config={config} onDismissed={onDismissed} onShow={onShow}/>))}
    </react_native_screens_1.ScreenStack>);
};
exports.ModalsRenderer = ModalsRenderer;
function NativeModal({ config, onDismissed, onShow }) {
    const stackPresentation = (0, utils_1.getStackPresentationType)(config);
    const stackAnimation = (0, utils_1.getStackAnimationType)(config);
    const shouldUseContentHeight = stackPresentation === 'formSheet';
    const [activityState, setActivityState] = (0, react_1.useState)(0);
    const isRegistered = (0, react_1.useRef)(false);
    const hadLayout = (0, react_1.useRef)(false);
    const { getHost } = (0, react_1.use)(Portal_1.PortalContext);
    const hostConfig = getHost(config.uniqueId);
    const maybeShowModal = (0, react_1.useCallback)(() => {
        // We only want to show the modal if it is registered and has layout
        // Otherwise, layout glitches can occur
        if (isRegistered.current &&
            hadLayout.current &&
            (!hostConfig?.shouldUseContentHeight || hostConfig?.contentSize?.height)) {
            setActivityState(2);
        }
    }, [hostConfig?.contentSize?.height, hostConfig?.shouldUseContentHeight]);
    (0, react_1.useEffect)(() => {
        maybeShowModal();
    }, [maybeShowModal]);
    return (<react_native_screens_1.ScreenStackItem key={config.uniqueId} {...config.viewProps} screenId={`__modal-${config.uniqueId}`} activityState={activityState} stackPresentation={stackPresentation} stackAnimation={stackAnimation} nativeBackButtonDismissalEnabled headerConfig={{
            hidden: true,
        }} contentStyle={[
            {
                backgroundColor: config.transparent ? 'transparent' : 'white',
            },
            config.viewProps?.style,
        ]} sheetAllowedDetents={config.detents} style={[
            react_native_1.StyleSheet.absoluteFill,
            {
                backgroundColor: config.transparent ? 'transparent' : 'white',
            },
        ]} onDismissed={() => {
            onDismissed?.(config.uniqueId);
        }} onAppear={() => {
            onShow?.(config.uniqueId);
        }}>
      <Portal_1.ModalPortalHost hostId={config.uniqueId} style={{
            width: '100%',
            height: '100%',
        }} useContentHeight={shouldUseContentHeight} onLayout={() => {
            hadLayout.current = true;
            maybeShowModal();
        }} onRegistered={() => {
            isRegistered.current = true;
            maybeShowModal();
        }}/>
    </react_native_screens_1.ScreenStackItem>);
}
const styles = react_native_1.StyleSheet.create({
    stackContainer: {
        flex: 1,
    },
});
//# sourceMappingURL=ModalsRenderer.js.map