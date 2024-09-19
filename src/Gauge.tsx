import React, { useRef, useState, useEffect, useCallback } from 'react';

import './Gauge.css';

export const Gauge: React.FC<any> = ({
  threshHoldsProp = {},
  minProp = 0,
  maxProp = 100,
  mouseDownProp = () => {},
  step = 0.01,
  title = '',
  initialValue = 0,
  circularProp = false,
  settingProp = '',
  tooltipProp = '',
  isMoneyProp = false,
  isPercentProp = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [rotation, setRotation] = useState(90);
  const [min] = useState(minProp);
  const [max] = useState(maxProp);
  const [circular] = useState(circularProp);
  const [maxDegrees] = useState(180);
  const [isMoney] = useState(isMoneyProp);
  const [isPercent] = useState(isPercentProp);
  const [bgColor, setBgColor] = useState('#007fff');
  const [threshHolds] = useState(threshHoldsProp);
  const [locked, setLocked] = useState(true);
  // @ts-ignore
  const [tooltip, setTooltip] = useState(tooltipProp);
  // @ts-ignore
  const [setting, setSetting] = useState(settingProp);
  const rotate = useCallback(
    (v: number) => {
      setRotation(
        convertRange(v, { min: min, max: max }, { min: -90, max: 90 })
      );
      if (Object.keys(threshHolds).length > 0) {
        for (let key of Object.keys(threshHolds)) {
          if (v > Number(key)) {
            setBgColor(threshHolds[key]);
          }
        }
      }
    },
    [setRotation, setBgColor, max, min, threshHolds]
  );

  const ticks = [];

  const lock = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
      <path
        fill="#c9d3e0"
        d="m3,9h1V6a5,5 0 0,1 12,0V9h1v11H3M14,9V6a4,4 0 1,0-8,0v3"
      />
    </svg>
  );

  const unlocked = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="2 2 20 20"
    >
      <g transform="matrix(.04252 0 0 .04252 3 2.958)" fill="#c9d3e0">
        <path d="m299.02 161.26h-185.84v-46.28c0-41.34 33.635-74.979 74.979-74.979 33.758 0 63.51 22.716 72.36 55.24 2.898 10.657 13.888 16.946 24.547 14.05 10.659-2.898 16.949-13.889 14.05-24.548-13.57-49.896-59.2-84.74-110.96-84.74-63.4 0-114.98 51.58-114.98 114.98v46.715c-9.06 1.902-15.888 9.952-15.888 19.571v175.05c0 11.03 8.972 20 20 20h221.73c11.03 0 20-8.972 20-20v-175.05c0-11.03-8.972-20-20-20" />
        <path d="m215.02 310.91c.408 2.162-1.058 3.931-3.258 3.931h-46.677c-2.2 0-3.666-1.769-3.258-3.931l7.432-39.39c-5.626-5.131-9.157-12.52-9.157-20.734 0-15.495 12.561-28.06 28.06-28.06 15.495 0 28.06 12.561 28.06 28.06 0 7.991-3.346 15.195-8.707 20.305z" />
      </g>
    </svg>
  );

  const convertRange = (
    v: number,
    oldRange: { min: any; max: any },
    newRange: { min: any; max: any }
  ) => {
    return (
      ((v - oldRange.min) * (newRange.max - newRange.min)) /
        (oldRange.max - oldRange.min) +
      newRange.min
    );
  };
  for (let i = 0; i <= maxDegrees; i = i + 18) {
    if (i > 0 && i < maxDegrees) {
      let tick = (
        <>
          <div
            className="tickmark"
            style={{ transform: 'rotate(' + (i - maxDegrees / 2) + 'deg)' }}
          >
            <div
              className="line"
              // style={{ transform: 'rotate(' + (i - 90) + 'deg)' }}
            ></div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              className="tick"
            >
              {isPercent
                ? convertRange(
                    i,
                    { min: 0, max: circular ? 360 : 180 },
                    { min: min, max: max }
                  ) * 100
                : convertRange(
                    i,
                    { min: 0, max: circular ? 360 : 180 },
                    { min: min, max: max }
                  )}
            </div>
          </div>
        </>
      );
      ticks.push(tick);
    }
  }

  const ref = useRef(null);

  // const [min, setMin] = useState(0);
  // const [max, setMax] = useState(100);
  return (
    <div
      className="container"
      data-tooltip-id="my-tooltip"
      data-tooltip-content={tooltip}
      data-tooltip-position-strategy="absolute"
    >
      {/* <Tooltip place="bottom" id="my-tooltip" className="tooltip"   /> */}
      <div
        className="drag-layer"
        ref={ref}
        onPointerMove={(evt) => {
          if (mouseIsDown) {
            const rect = evt.currentTarget.getBoundingClientRect();

            const center = {
              x: rect.right - rect.width / 2 + window.scrollX,
              y: rect.bottom + window.scrollY,
            };
            //console.log(center)
            let newRotation =
              (Math.atan2(center.y - evt.pageY, center.x - evt.pageX) * 180) /
                Math.PI -
              90;
            //console.log(newRotation)
            if (newRotation < -250) {
              newRotation = 90;
            }
            if (newRotation < -90) {
              newRotation = -90;
            }

            // setRotation(newRotation);
            let v =
              Math.round(
                convertRange(
                  newRotation,
                  { min: -90, max: 90 },
                  { min: min, max: max }
                ) / step
              ) * step;
            setValue(v.toFixed(2));
            rotate(v);
          }
        }}
        onMouseDown={() => {
          if (!locked) {
            setMouseIsDown(true);
          }
        }}
        onMouseUp={() => {
          if (!locked) {
            setMouseIsDown(false);
            mouseDownProp(value);
          }
        }}
        onMouseLeave={() => {
          if (!locked) {
            setMouseIsDown(false);
          }
        }}
      >
        <div className="gauge-title">{title} </div>

        <div
          className={['gauge', circular ? 'circular' : 'half-circle'].join(' ')}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            backgroundColor: bgColor,
          }}
        >
          <div className="circle"></div>
          <div
            className="needle"
            style={{ transform: 'rotate(' + rotation + 'deg)' }}
          ></div>
          {ticks}
          <div className="value">
            {isMoney ? '$' : ''}
            {isPercent
              ? (parseFloat(value) * 100).toFixed(2)
              : parseFloat(value).toFixed(2)}
            {isPercent ? '%' : ''}
          </div>
        </div>
      </div>
      <div className="fine-tuner">
        <button
          onClick={() => {
            if (!locked) {
              let newVal = Number(value) - Number(step);
              setValue(newVal.toFixed(2));
              rotate(newVal);
              mouseDownProp(newVal.toFixed(2));
            }
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            if (!locked) {
              let newVal = Number(value) + Number(step);
              setValue(newVal.toFixed(2));
              rotate(newVal);
              mouseDownProp(newVal.toFixed(2));
            }
          }}
        >
          +
        </button>
      </div>
      <div
        className="lock"
        onClick={() => {
          setLocked(!locked);
        }}
      >
        {locked ? lock : unlocked}
      </div>
    </div>
  );
};

export default Gauge;
