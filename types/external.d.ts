declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export type DependencyList = readonly unknown[];
  export type MutableRefObject<T> = { current: T };
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: DependencyList): void;
  export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList | undefined): T;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): MutableRefObject<T | null>;
  export function useContext<T>(context: any): T;
  export function createContext<T>(defaultValue: T): any;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => ReactElement | null): any;
  export function useImperativeHandle(ref: any, init: () => any, deps?: DependencyList): void;
  export function useTransition(): [boolean, (callback: () => void) => void];
  export function useLayoutEffect(effect: () => void | (() => void), deps?: DependencyList): void;
  export const Fragment: any;
  export interface ReactExports {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useMemo: typeof useMemo;
    useCallback: typeof useCallback;
    useRef: typeof useRef;
    useContext: typeof useContext;
    createContext: typeof createContext;
    forwardRef: typeof forwardRef;
    useImperativeHandle: typeof useImperativeHandle;
    useTransition: typeof useTransition;
    useLayoutEffect: typeof useLayoutEffect;
    Fragment: any;
  }
  const React: ReactExports;
  export default React;
}

declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace React {
  export type ReactNode = any;
  export type ReactElement = any;
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;
  export type DependencyList = readonly unknown[];
  export type MutableRefObject<T> = { current: T };
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: DependencyList): void;
  export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList | undefined): T;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useContext<T>(context: any): T;
  export function createContext<T>(defaultValue: T): any;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => ReactElement | null): any;
  export function useImperativeHandle(ref: any, init: () => any, deps?: DependencyList): void;
  export function useTransition(): [boolean, (callback: () => void) => void];
  export function useLayoutEffect(effect: () => void | (() => void), deps?: DependencyList): void;
  export const Fragment: any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const StyleSheet: { create<T extends Record<string, any>>(styles: T): T; absoluteFillObject: any };
  export const TouchableOpacity: any;
  export const ScrollView: any;
  export const FlatList: any;
  export const SectionList: any;
  export const ActivityIndicator: any;
  export const Modal: any;
  export const Platform: { OS: string; select: <T>(options: Record<string, T>) => T | undefined };
  export namespace Animated {
    class Value {
      constructor(value: number);
      setValue(value: number): void;
      interpolate(config: any): any;
    }
    const View: any;
    function timing(...args: any[]): any;
    function loop(...args: any[]): any;
    function sequence(...args: any[]): any;
    function parallel(...args: any[]): any;
    function delay(ms: number): any;
    const Image: any;
  }
  export const Animated: typeof Animated;
  export const Easing: any;
  export const Dimensions: { get: (dim: 'window' | 'screen') => { width: number; height: number } };
  export const Image: any;
  export const Alert: any;
  export const Switch: any;
  export const Pressable: any;
  export const SafeAreaView: any;
  export const Linking: any;
  export const RefreshControl: any;
  export type ImageURISource = { uri: string };
  export type StyleProp<T> = T;
  export type ViewStyle = Record<string, any>;
  export type TextStyle = Record<string, any>;
  export type ImageStyle = Record<string, any>;
  export type ColorValue = string;
}

declare module 'react-native-safe-area-context' {
  export const SafeAreaProvider: any;
  export const SafeAreaView: any;
  export function useSafeAreaInsets(): { top: number; bottom: number; left: number; right: number };
}

declare module '@tanstack/react-query' {
  export class QueryClient {
    constructor(options?: any);
    invalidateQueries: (...args: any[]) => Promise<void>;
  }
  export const QueryClientProvider: any;
  export const useQuery: any;
  export const useMutation: any;
}

declare module 'expo-router' {
  export const router: {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    setParams: (params: Record<string, any>) => void;
  };
  export const Stack: any;
  export const Tabs: any;
  export const Redirect: any;
  export function useLocalSearchParams<T extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>>(): T;
}

declare module 'expo-blur' {
  export type BlurTint = 'light' | 'dark' | 'default' | 'systemMaterial';
  export const BlurView: any;
}

declare module 'lucide-react-native' {
  export const Mountain: any;
  export const MapPin: any;
  export const AlertTriangle: any;
  export const Clock: any;
  export const ShieldAlert: any;
  export const Waves: any;
  export const Bell: any;
  export const Globe: any;
  export const Navigation: any;
  export const Wind: any;
  export const Settings: any;
  export const Info: any;
  export const Shield: any;
  export const Activity: any;
  export const Map: any;
  export const List: any;
  export const BookOpen: any;
  export const Flame: any;
  export const SortAsc: any;
  export const RefreshCw: any;
  export const SlidersHorizontal: any;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const ChevronUp: any;
  export const ChevronDown: any;
  export const Layers: any;
  export const Radio: any;
  export const RotateCw: any;
  export const X: any;
}

declare module 'expo-splash-screen' {
  export function preventAutoHideAsync(): Promise<void>;
  export function hideAsync(): Promise<void>;
}

declare module 'expo-location' {
  export enum Accuracy {
    Lowest,
    Low,
    Balanced,
    High,
    Highest,
    BestForNavigation,
  }
  export type LocationObject = { coords: { latitude: number; longitude: number; accuracy: number | null } };
  export async function requestForegroundPermissionsAsync(): Promise<{ status: 'granted' | 'denied' }>;
  export async function getCurrentPositionAsync(options?: any): Promise<LocationObject>;
  export function watchPositionAsync(options: any, callback: (location: LocationObject) => void): Promise<{ remove: () => void }>;
}

declare module 'expo-sqlite' {
  export interface SQLiteDatabase {
    execAsync: (queries: string | string[]) => Promise<void>;
    getAllAsync: <T = any>(query: string, params?: any[]) => Promise<T[]>;
    getFirstAsync: <T = any>(query: string, params?: any[]) => Promise<T | undefined>;
    runAsync: (query: string, params?: any[]) => Promise<void>;
    withTransactionAsync: (fn: () => Promise<void>) => Promise<void>;
  }
  export function openDatabase(name: string): SQLiteDatabase;
  export function openDatabaseAsync(name: string): Promise<SQLiteDatabase>;
}

declare module '@nkzw/create-context-hook' {
  const createContextHook: any;
  export default createContextHook;
}

declare module '@trpc/react-query' {
  export function createTRPCReact<TRouter = any>(): any;
}

declare module '@trpc/client' {
  export const httpLink: any;
}

declare module 'superjson' {
  const superjson: any;
  export default superjson;
}

declare module '@trpc/server' {
  export const initTRPC: {
    context: <TContext = unknown>() => {
      create: (opts?: any) => any;
      router: (...args: any[]) => any;
      procedure: any;
    };
  };
  export type inferAsyncReturnType<T> = any;
}

declare module '@trpc/server/adapters/fetch' {
  export type FetchCreateContextFnOptions = any;
}

declare module 'hono/cors' {
  export const cors: (...args: any[]) => any;
}

declare module 'zod' {
  export const z: any;
}

declare module 'hono' {
  export class Hono {
    use: (...args: any[]) => this;
    get: (...args: any[]) => this;
  }
}

declare module '@hono/trpc-server' {
  export const trpcServer: any;
}

declare module 'react-native-gesture-handler' {
  export const GestureHandlerRootView: any;
}

declare module 'expo-constants' {
  const Constants: any;
  export default Constants;
}

declare module 'expo-linear-gradient' {
  export const LinearGradient: any;
}

declare module 'expo-haptics' {
  export const impactAsync: (...args: any[]) => Promise<void>;
  export const notificationAsync: (...args: any[]) => Promise<void>;
  export const ImpactFeedbackStyle: any;
  export const NotificationFeedbackType: any;
}

declare module 'expo-image-picker' {
  export const launchImageLibraryAsync: (...args: any[]) => Promise<any>;
}

declare module 'expo-notifications' {
  export const getPermissionsAsync: (...args: any[]) => Promise<any>;
  export const requestPermissionsAsync: (...args: any[]) => Promise<any>;
}

declare module 'expo-system-ui' {
  export const setBackgroundColorAsync: (...args: any[]) => Promise<void>;
}

declare module 'expo-font' {
  export const loadAsync: (...args: any[]) => Promise<void>;
}

declare module 'expo-image' {
  export const Image: any;
}

declare module 'expo-maps' {
  const MapView: any;
  export default MapView;
}

declare module 'react-native-maps' {
  export const Marker: any;
  export const Polyline: any;
  export const Circle: any;
  const MapView: any;
  export default MapView;
}

declare module 'expo-web-browser' {
  export const openBrowserAsync: (...args: any[]) => Promise<any>;
}

declare module '@ungap/structured-clone' {
  export function structuredClone<T>(value: T): T;
}

declare module '@stardazed/streams-text-encoding' {
  export const TextDecoderStream: any;
  export const TextEncoderStream: any;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: any;
  export default AsyncStorage;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
}

declare module '@react-navigation/bottom-tabs' {
  export const createBottomTabNavigator: any;
}

declare var process: { env: Record<string, string | undefined> };
