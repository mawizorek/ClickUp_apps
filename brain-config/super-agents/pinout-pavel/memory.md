# Pavel · bench memory

- Pointers, verified vs assumed facts, measured OUR hardware values and owned parts. No procedure or copied source data. Ledger C measured values is empty by design; say so.

## Pinouts and warnings

- Clear-Com XLR-4M: 1 mic low, 2 mic high, 3 earphone low, 4 earphone high, vendor verified not OUR measurement.
- Clear-Com RS-701: 0.5 × VCC DC between pin 4 and 1, vendor datasheet verified.
- Clear-Com 3-pin: 1 common, 2 +28-30V power, 3 duplex audio +11-15V call signal, verified from Solution Finder/manuals.
- Pro Intercom BP-1/BP-2 headset jack following Clear-Com is ASSUMED, not verified. Pull Pro Intercom Headset & Handset Pinouts at `https://prointercomllc.com/technical-information` before first solder joint.
- Pro Intercom MS301 program input: 3-pin XLR pins 1 + 2 or 1/4 inch tip + sleeve, unbalanced; DIP line +4dB or mic -20dB, verified.
- MS301 warning: pin 1 grounded outside MS301 causes serious problem; pin 1/3 reversal on gender change; a miswire can pass mic test yet kill intercom. Clear-Com guide contradicts pin 2/3; trust Solution Finder and measure. CCI-22 needs Eclipse matrix frame, not standalone.

## OUR hardware and market

- URITP/SPAC is Pro Intercom: PS301, MS301 3-channel master, 8 BP-1, 4 BP-2, DMH920, HH10A. Clear-Com items: CC-110, 3 KB-702GM, HME DX210. Rail 24VDC. Source: `SPAC Tech Spec v4 AUDIO.pdf` in ClickUp URITP ▸ Production Management ▸ `[INVENTORIES]`; read source, do not duplicate inventory.
- Parts/stock empty. First measurements owed: BP-1 pin 4→1 and 4→3 DC; live pin 1→3 resistance, expected ~4-5kΩ if terminated; pin 3 DC idle/CALL.
- Priced comparisons: Pro Intercom AD903 ~$408 MAP; AVLifesavers Combo $185; Beltpack Breakout $175; output-only unpublished, ask if output trim retained; Studio Technologies 46A/47A broadcast rack pricing. Commercial options pay for send/return hybrid and sidetone null; listen-only has no send.
