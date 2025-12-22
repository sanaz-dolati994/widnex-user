import { PureComponent, useEffect, useRef, useState } from "react"
import { useMainContext } from "../../../core/contexts/main"
import { useWindowSize } from "../../../core/hooks/useWindowSize"
import useClickOutside from "../../../core/hooks/useClickOutside"
import { MOBILE_SIZE } from "../../../core/constants/common";


const TradingChart = ({ isMain }) => {

    const { market, main: { lang, theme } } = useMainContext()
    const { width } = useWindowSize()

    const [mobileChartVisible, setMobileCharVisible] = useState(false)
    const [pair, setPair] = useState("KUCOIN:BTCUSDT")

    const specialCases = ['usdt']

    useEffect(() => {
        if (market?.pair === "irt") {
            if (specialCases.includes(market.coin))
                setPair(`${market?.coin?.toUpperCase()}USD`)
            else
                setPair(`KUCOIN:${market?.coin?.toUpperCase()}USDT`)
        } else {
            setPair(`KUCOIN:${market?.coin?.toUpperCase()}${market?.pair?.toUpperCase()}`)
        }
    }, [market])

    const ref = useRef()
    useClickOutside(ref, () => setMobileCharVisible(false))


    return (
        <>
            <TradingViewWidget
                symbol={pair}
                enable_publishing={false}
                hide_side_toolbar={false}
                allow_symbol_change={true}
                theme={theme === "dark" ? Themes.DARK : Themes.LIGHT}
                locale={lang}
                autosize
            />
        </>

    )
}

export const BarStyles = {
    BARS: '0',
    CANDLES: '1',
    HOLLOW_CANDLES: '9',
    HEIKIN_ASHI: '8',
    LINE: '2',
    AREA: '3',
    RENKO: '4',
    LINE_BREAK: '7',
    KAGI: '5',
    POINT_AND_FIGURE: '6'
};

export const IntervalTypes = {
    D: 'D',
    W: 'W'
};

export const RangeTypes = {
    YTD: 'ytd',
    ALL: 'all'
};

export const Themes = {
    LIGHT: 'Light',
    DARK: 'Dark'
};

const SCRIPT_ID = 'tradingview-widget-script';
const CONTAINER_ID = 'tradingview-widget';

class TradingViewWidget extends PureComponent {

    static defaultProps = {
        allow_symbol_change: true,
        autosize: false,
        enable_publishing: false,
        height: 610,
        hideideas: true,
        hide_legend: false,
        hide_side_toolbar: true,
        hide_top_toolbar: false,
        interval: IntervalTypes.D,
        locale: 'en',
        save_image: true,
        show_popup_button: false,
        style: BarStyles.CANDLES,
        theme: Themes.LIGHT,
        timezone: 'Etc/UTC',
        toolbar_bg: '#F1F3F6',
        widgetType: 'widget',
        width: 980,
        withdateranges: false
    };

    containerId = `${CONTAINER_ID}-${Math.random()}`;

    componentDidMount = () => this.appendScript(this.initWidget);

    componentDidUpdate = () => {
        this.cleanWidget();
        this.initWidget();
    };

    canUseDOM = () => !!(
        typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement
    );

    appendScript = (onload) => {
        if (!this.canUseDOM()) {
            onload();
            return;
        }

        if (this.scriptExists()) {
            /* global TradingView */
            if (typeof TradingView === 'undefined') {
                this.updateOnloadListener(onload);
                return;
            }
            onload();
            return;
        }
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://s3.tradingview.com/tv.js';
        script.onload = onload;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    getScriptElement = () =>
        document.getElementById(SCRIPT_ID);

    scriptExists = () =>
        this.getScriptElement() !== null;

    updateOnloadListener = (onload) => {
        const script = this.getScriptElement();
        const oldOnload = script.onload;
        return script.onload = () => {
            oldOnload();
            onload();
        };
    };

    initWidget = () => {
        /* global TradingView */
        if (typeof TradingView === 'undefined' || !document.getElementById(this.containerId)) return;

        const { widgetType, ...widgetConfig } = this.props;
        const config = { ...widgetConfig, container_id: this.containerId };

        if (config.autosize) {
            delete config.width;
            delete config.height;
        }

        if (typeof config.interval === 'number') {
            config.interval = config.interval.toString();
        }

        if (config.popup_width && typeof config.popup_width === 'number') {
            config.popup_width = config.popup_width.toString();
        }

        if (config.popup_height && typeof config.popup_height === 'number') {
            config.popup_height = config.popup_height.toString();
        }

        /* global TradingView */
        new TradingView[widgetType](config);
    };
    cleanWidget = () => {
        if (!this.canUseDOM()) return;
        document.getElementById(this.containerId).innerHTML = '';
    };

    getStyle = () => {
        if (!this.props.autosize) return {};
        return {
            width: '100%',
            height: '100%'
        };
    };

    render = () => <article id={this.containerId} style={this.getStyle()} />
}


export default TradingChart;
