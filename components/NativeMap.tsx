import { Platform } from 'react-native';
import NativeMapWeb from './NativeMap.web';
import NativeMapNative from './NativeMap.native';

const NativeMapComponent = Platform.OS === 'web' ? NativeMapWeb : NativeMapNative;

export default NativeMapComponent;