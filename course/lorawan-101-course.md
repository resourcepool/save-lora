# LoRaWAN 101

LoRaWAN™ is a protocol specification based on the LoRa technology developed by the LoRa Alliance.  
It was originally developed by Cycleo of Grenoble, France, and acquired by Semtech in 2012.  
LoRaWAN targets the basic needs of LoRa usage for IoT by providing long-range, low-power and small data rate connectivity as much as Addressing, Routing and Security capability.

LoRa uses license-free sub-gigahertz radio frequency bands like 169 MHz, 433 MHz, 868 MHz (Europe) and 915 MHz (North America). LoRa enables long-range transmissions (more than 10 km in rural areas) with low power consumption. The technology is presented in two parts: **LoRa**, the **physical layer** and **LoRaWAN** (Long Range Wide Area Network), the **upper layers**.

## LoRa PHY
The LoRa physical layer protocol is proprietary; therefore, there is no freely available official documentation.

LoRa uses a proprietary spread spectrum modulation that is similar to and a derivative of Chirp Spread Spectrum modulation (CSS). This allows LoRa to trade off data rate for sensitivity with a fixed channel bandwidth by selecting the amount of spread used (a selectable parameter radio parameter from 7 to 12). This spreading factor determines the data rate and dictates the sensitivity of a radio. In addition, LoRa uses Forward Error Correction coding to improve resilience against interference.

## LoRaWAN
Since LoRa defines the lower physical layer, the upper networking layers were lacking. LoRaWAN was developed to define the upper layers of the network. LoRaWAN is a media access control (MAC) layer protocol but acts mainly as a network layer protocol for managing communication between LPWAN gateways and end-node devices as a routing protocol, maintained by the LoRa Alliance. Version 1.0 of the LoRaWAN specification was released in June 2015.

LoRaWAN defines the communication protocol and system architecture for the network, while the LoRa physical layer enables the long-range communication link. LoRaWAN is also responsible for managing the communication frequencies, data rate, and power for all devices.

## About DevEUIs

LoRa devices have a unique identifier (DevEUI) that is assigned to the device by the chip manufacturer. This identifier is used to uniquely identify the device on the network.

## How LoRaWAN™ works

Topology of a LoRaWAN network consists of several elements.

* **End Nodes:** End nodes are elements such as sensors, which are usually remotely located.
* **Concentrator / Gateway:** Gateways are access points for for end nodes (e.g. sensors), aggregating data and communicating that data to a central network server via standard IP connections. Several gateways can be co-located in an area and can transparently share a single connection to the network server.
* **Network Server:** The LoRa Network Server acts to eliminate duplicate packets, manages security and data rates.
* **Application Server:** Application Servers manage payload security and performs analysis to utilize sensor data. Cayenne operates as an Application Server.


LoRaWAN end nodes cannot communicate between each other. All communication goes to the gateway and the App Server.

End device#1 -┐  
End device#2 -┼- Gateway  
End device#n -┘  


------

## Typical Architecture

![LoRaWAN architecture](https://www.loraserver.io/img/architecture.png)

**LoRaWAN devices**  
The IoT devices (not pictured in the image above) are the devices sending data to the LoRa network (through the LoRa gateways). These devices could be for example sensors measuring air quality, temperature, humidity, location…

**LoRa Gateway & Bridge**  
The gateways are receiving the data packets from the devices, and act as an interface between the LoRa hardware (antenna, modem, etc...) and the gateway.  
The packets received are then “transformed” into MQTT messages sent to a remote MQTT Broker.

**LoRa App Server**  
The LoRa App Server component implements a LoRaWAN application-server. It consumes the MQTT messages published to the broker and handles all protocol-logic linked to it. It also provides a web-interface and APIs for management of users, organizations, applications, gateways and devices.

To receive the application payload sent by one of your devices, you need to interact with the LoRaWAN App Server REST API.


**In a summary:**  
Devices in the network are asynchronous and transmit when they have data available to send. Data transmitted by an end-node device is received by multiple **gateways**, which forward the data packets to a **centralized network server**. The network server filters duplicate packets, performs security checks, and manages the network. Data is then forwarded to **application servers**.

## LoRaWAN Classes

### Bi-directional end-devices (Class A)

* End-devices of Class A allow for bi-directional communications whereby each end-device‘s uplink transmission is followed by two short downlink receive windows.
* The transmission slot scheduled by the end-device is based on its own communication needs with a small variation based on a random time basis (**ALOHA**-type of protocol).

### Bi-directional end-devices with scheduled receive slots (Class B)

* End-devices of Class B allow for more receive slots.
* In addition to the Class A random receive windows, Class B devices open extra receive windows at scheduled times.
* In order for the End-device to open it receive window at the scheduled time it receives a time synchronized Beacon from the gateway. This allows the server to know when the end-device is listening.

### Bi-directional end-devices with maximal receive slots (Class C)

* End-devices of Class C have nearly continuously open receive windows, only closed when transmitting.
* Class C end-device will use more power to operate than Class A or Class B but they offer the lowest latency for server to end-device communication.

## End-device Receive Slot Timing

![End-device Receive Slot Timing](https://i.imgur.com/xky7Mlv.jpg)

* RX1 and RX2 are receive windows opened by the end device.
* If it is in activation process, the delay will be **JOIN_ACCEPT_DELAY1** and **JOIN_ACCEPT_DELAY2**.
* If it is in normal data transferring, the delay will be **RECEIVE_DELAY1** and **RECEIVE_DELAY2**.
* If a preamble is detected during one of the receive windows, the radio receiver stays active until the downlink frame is demodulated.
* The length of a receive window must be at least the time required by the end-device‘s radio transceiver to effectively detect a downlink preamble.
* If a frame was detected and subsequently demodulated during the first receive window and the frame was intended for this end-device after address and MIC (message integrity code) checks, the end-device does not open the second receive window.
* These values of the parameters should be referred to **LoRaWAN 1.0.2 Regional Parameters**

## MAC Frame Format

### Join Request Message Format (End-device -> Gateway)

![Join Request](https://i.imgur.com/kybTy0m.jpg)

### Join Accept Message Format (Gateway -> End-device)

![Join Accept](https://i.imgur.com/CGbpEfR.jpg)

### MAC Data Message Format (End-device <-> Gateway)

![MAC Data Message](https://i.imgur.com/bqtRauN.jpg)

### MHDR - MAC Header

7..5 bits | 4..2 bits | 1..0 bits
----------|-----------|----------
MType     | RFU       | Major

* MType

  MType | Description
  ------|----------------------
  000   | Join Request
  001   | Join Accept
  010   | Unconfirmed Data Up
  011   | Unconfirmed Data Down
  100   | Confirmed Data Up
  101   | Confirmed Data Down
  110   | RFU
  111   | Proprietary

* Major

  Major bits | Description
  -----------|------------
  00         | LoRaWAN R1

### MIC - Message Integrity Code

The **MIC** will be defined by each message type.

## For MAC Data Message

### FHDR - Frame Header

* FCtrl - Frame Control

  - For Uplink Frames

    7 bit | 6 bit     | 5 bit | 4 bit | 3..0 bits
    ------|-----------|-------|-------|----------
    ADR   | ADRACKReq | ACK   | RFU   | FOptsLen

  - For Downlink Frames

    7 bit | 6 bit | 5 bit | 4 bit    | 3..0 bits
    ------|-------|-------|----------|----------
    ADR   | RFU   | ACK   | FPending | FOptsLen

  - ADR
    * If the **ADR** bit is set, the network will control the data rate of the end-device through the appropriate MAC commands. If the **ADR** bit is not set, the network will not attempt to control the data rate of the end-device regardless of the received signal quality.
    * The **ADR** bit may be set and unset by the end-device or the Network on demand.

  - ADRACKReq
    In uplink transmissions the **ADRACKReq** bit is set if *ADR_ACK_CNT >= ADR_ACK_LIMIT* and the current data-rate is greater than the device defined minimum data rate, it is cleared in other conditions.

  - ACK
    When receiving a confirmed data message, the receiver shall respond with a data frame that has the acknowledgment bit **ACK** set.

  - FPending
    The frame pending bit **FPending** is only used in downlink communication, indicating that the gateway has more data pending to be sent and therefore asking the end-device to open another receive window as soon as possible by sending another uplink message.

  - FOptsLen
    The frame-options length field **FOptsLen** in FCtrl byte denotes the actual length of the frame options field **FOpts** included in the frame.

### Retransmission Procedure

The number of retransmissions (and their timing) for the same message where an acknowledgment is requested but not received is at the discretion of the end device and may be different for each end-device.

### FCnt - Frame counter

* Each end-device has two frame counters to keep track of the number of data frames sent uplink to the network server **FCntUp**, incremented by the end-device and received by the end-device downlink from the network server **FCntDown**, which is incremented by the network server.
* The network server tracks the uplink frame counter and generates the downlink counter for each end-device.
* After a JoinReq – JoinAccept message exchange or a reset for a personalized end-device, the frame counters on the end-device and the frame counters on the network server for that end-device are reset to 0.
* The FCnt is not incremented in case of multiple transmissions of an *unconfirmed frame*, or in the case of a confirmed frame that is *not acknowledged*.
* The end-device shall not reuse the same **FCntUp** value, except for retransmission, with the same application and network session keys.

### FPort - Port Field

* If the frame payload field is not empty, the port field must be present. If present, an FPort value of 0 indicates that the FRMPayload contains MAC commands only.
* FPort values 1..223 (0x01..0xDF) are application-specific.
* FPort value 224 is dedicated to LoRaWAN Mac layer test protocol.
* FPort values 225..255 (0xE1..0xFF) are reserved for future standardized application extensions.

### FOpts - Frame Options

* FOpts transport MAC commands of a maximum length of 15 octets that are piggybacked onto data frames.
* If FOptsLen is 0, the FOpts field is absent. If FOptsLen is different from 0, i.e. if MAC commands are present in the FOpts field, the port 0 cannot be used (FPort must be either not present or different from 0).
* MAC commands cannot be simultaneously present in the payload field and the frame options field.

### MAC Frame Payload Encryption

* If a data frame carries a payload, FRMPayload must be encrypted before the message integrity code (MIC) is calculated.
* The encryption scheme used is based on the generic algorithm described in *IEEE 802.15.4/2006 Annex B* [IEEE802154] using AES with a key length of 128 bits.
* The key K used depends on the FPort of the data message:

  FPort  | K
  -------|--------
  0      | NwkSkey
  1..255 | AppSKey
  
* pld = **FRMPayload**
* sequence of Blocks *A_i* for i = 1..k with k = ceil(len(pld) / 16)

  bytes | 1    | 4        | 1   | 4       | 4    | 1    | 1
  ------|------|----------|-----|---------|------|------|--
  *A_i* | 0x01 | 4 X 0x00 | Dir | DevAddr | FCnt | 0x00 | i
  - **Dir** is 0 for uplink frames and 1 for downlink frames
  - blocks *A_i* are encrypted to get a sequence S of blocks *S_i*:
    *S_i = aes128_encrypt(K, A_i) for i = 1..k*
    *S = S_1 | S_2 | .. | S_k*
    
* Encryption and decryption of the payload is done by truncating
  *(pld | pad_16 ) xor S*
  to the first len(pld) octets.
* Use AES 128 bits CTR mode
* Padding by zeroes
https://www.thethingsnetwork.org/forum/t/questions-about-aes128-encryption-of-a-frmpayload-payload/4207

### MIC - Message Integrity Code

* The message integrity code *MIC* is calculated over all the fields in the message.
  *msg = MHDR | FHDR | FPort | FRMPayload*
* The MIC is calculated as follows [RFC4493]:
  *cmac = aes128_cmac(NwkSKey, *B_0* | msg)*
  *MIC = cmac[0..3]*
  
  bytes | 1    | 4        | 1   | 4       | 4    | 1    | 1
  ------|------|----------|-----|---------|------|------|---------
  *B_0* | 0x49 | 4 X 0x00 | Dir | DevAddr | FCnt | 0x00 | len(msg)

### MAC Commands

A single data frame can contain any sequence of MAC commands in 2 ways:
1. Piggybacked in the FOpts field or
   - Piggybacked MAC commands are always sent without encryption
   - Must not exceed 15 octets
2. Sent as a separate data frame, in the FRMPayload field with the FPort field being set to 0
   - MAC commands sent as FRMPayload are always encrypted
   - Must not exceed the maximum FRMPayload length

1 byte | Some more bytes
-------|----------------
CID    | Command's data

#### CID - Command identifier

CID  | Command          | Transmitted by | Short Description
-----|------------------|----------------|------------------
0x02 | LinkCheckReq     | End-device     | Used by an end-device to validate its connectivity to a network
0x02 | LinkCheckAns     | Gateway        | Answer to LinkCheckReq command
0x03 | LinkADRReq       | Gateway        | Requests the end-device to change data rate, transmit power, repetition rate or channel
0x03 | LinkADRAns       | End-device     | Acknowledges the LinkRateReq
0x04 | DutyCycleReq     | Gateway        | Sets the maximum aggregated transmit duty-cycle of a device
0x04 | DutyCycleAns     | End-device     | Acknowledges a DutyCycleReq command
0x05 | RXParamSetupReq  | Gateway        | Sets the reception slots parameters
0x05 | RXParamSetupAns  | End-device     | Acknowledges a RXSetupReq command
0x06 | DevStatusReq     | Gateway        | Requests the status of the end-device
0x06 | DevStatusAns     | End-device     | Returns the status of the end-device, namely its battery level and its demodulation margin
0x07 | NewChannelReq    | Gateway        | Creates or modifies the definition of a radio channel
0x07 | NewChannelAns    | End-device     | Acknowledges a NewChannelReq command
0x08 | RXTimingSetupReq | Gateway        | Sets the timing of the of the reception slots
0x08 | RXTimingSetupAns | End-device     | Acknowledges RXTimingSetupReq
0x09 | TxParamSetupReq  | Gateway        | Used by the network server to set the maximum allowed dwell time and Max EIRP of end-device, based on local regulations
0x09 | TxParamSetupAns  | End-device     | Acknowledges TxParamSetupReq command
0x0A | DlChannelReq     | Gateway        | Modifies the definition of a downlink RX1 radio channel by shifting the downlink frequency from the uplink frequencies
0x0A | DlChannelAns     | End-device     | Acknowledges DlChannelReq command
0x80..FF | Proprietary  | Both           | Reserved for proprietary network command extensions

The more detail and commands' data could be found in Chapter 5 of LoRaWAN 1.0.2 specification.

## Join Request-Accept Activation

### Over-the-Air Activation

The join procedure requires the end-device to be personalized with the following information before it starts the join procedure: a globally unique end-device identifier **DevEUI**, the application identifier **AppEUI**, and an AES-128 key **AppKey**.

#### AppEUI - Application identifier

* The AppEUI is a global application ID in IEEE EUI64 address space that uniquely identifies the entity able to process the JoinReq frame.

#### DevEUI - End-device identifier

* The DevEUI is a global end-device ID in IEEE EUI64 address space that uniquely identifies the end-device.

#### AppKey - Application key

* The AppKey is an AES-128 root key specific to the end-device.
* The AppKey is used to derive the session keys **NwkSKey** and **AppSKey** specific for that end-device to encrypt and verify network communication and application data.

### Join-Request Message

bytes        | 8      | 8      | 4
-------------|--------|--------|---------
Join-Request | AppEUI | DevEUI | DevNonce

#### DevNonce

* DevNonce is a random value provided by the end-device.
* For each end-device, the network server keeps track of a certain number of DevNonce values used by the end-device in the past, and ignores join requests with any of these DevNonce values from that end-device.

#### MIC for Join Request

*cmac = aes128_cmac(AppKey, MHDR | AppEUI | DevEUI | DevNonce)*
*MIC = cmac[0..3]*

### Join-Accept Message

bytes        | 3        | 3     | 4       | 1          | 1       | 0 or 16
-------------|----------|-------|---------|------------|---------|--------
Join-Request | AppNonce | NetID | DevAddr | DLSettings | RxDelay | CFList

#### AppNonce
* The AppNonce is a random value or some form of unique ID provided by the network server
* Used by the end-device to derive the two session keys **NwkSKey** and **AppSKey**
  ***NwkSKey** = aes128_encrypt(AppKey, 0x01 | AppNonce | NetID | DevNonce | pad_16 )*
  ***AppSKey** = aes128_encrypt(AppKey, 0x02 | AppNonce | NetID | DevNonce | pad_16 )*

#### NetID

* Assigned by the network manager

  23..7 bits                     | 6..0 bits
  -------------------------------|----------
  Chosen by the network operator | NwkID

#### DevAddr - End-device address

* Assigned by the network manager

  31..25 bits | 24..0 bits
  ------------|-----------
  NwkID       | NwkAddr

#### DLSettings

7 bit | 6..4 bits   | 3..0 bits
------|-------------|--------------
RFU   | RX1DRoffset | RX2 Data rate

* RX1DRoffset
  - Sets the offset between the uplink data rate and the downlink data rate used to communicate with the end-device on the first reception slot (RX1).
  - By default this offset is 0.
  - The offset is used to take into account maximum power density constraints for base stations in some regions and to balance the uplink and downlink radio link margins.
  - The actual relationship between the uplink and downlink data rate is region specific and detailed in the LoRaWAN Regional Parameters document [PARAMS].

#### MIC for Join Accept

*cmac = aes128_cmac(AppKey, MHDR | AppNonce | NetID | DevAddr | DLSettings | RxDelay | CFList)*
*MIC = cmac[0..3]*

#### Join-accept message itself is encrypted with the AppKey

*aes128_**decrypt**(AppKey, AppNonce | NetID | DevAddr | DLSettings | RxDelay | CFList | MIC)*

PS. The network server uses an AES decrypt operation in ECB mode to encrypt the join-accept message so that the end-device can use an AES encrypt operation to decrypt the message. This way **an end-device only has to implement AES encrypt but not AES decrypt**.



## Overview
LoRa is a wireless technology developed to create the low-power, wide-area networks (LPWANs) required for machine-to-machine (M2M) and Internet of Things (IoT) applications. The technology offers a very compelling mix of long range, low power consumption and secure data transmission and is gaining significant traction in IoT networks being deployed by wireless network operators.

A network based on LoRa wireless technology can provide coverage that is greater in range compared to that of existing cellular networks. In fact, many mobile network operators have chosen to complement their existing cellular/wireless networks with a LPWAN based on LoRa technology because it is easy to plug into their existing infrastructure and also allows them to offer their customers a solution to serve more IoT battery-operated applications.

LoRa technology originally developed by Semtech is now utilized by the over 400 members of the LoRa Alliance, a non-profit organization focused on standardizing LoRa Technology for IoT/M2M and creating a strong ecosystem to scale the technology. To date, the alliance has developed a global LPWAN specification, known as LoRaWAN™, to help standardize LPWANs and foster the adoption of these networks to enable IoT, M2M, smart city, and industrial applications.

<p id="how-it-works-lora" class="anchor-link"></p>
<p id="lora-how-lorawan-works" class="anchor-link"></p>


## Cayenne Low Power Payload

### Overview

The Cayenne Low Power Payload (LPP) provides a convenient and easy way to send data over LPWAN networks such as LoRaWAN.  The Cayenne LPP is compliant with the payload size restriction, which can be lowered down to 11 bytes, and allows the device to send multiple sensor data at one time.  

Additionally, the Cayenne LPP allows the device to send different sensor data in different frames. In order to do that, each sensor data must be prefixed with two bytes:

- **Data Channel:** Uniquely identifies each sensor in the device across frames, eg. “indoor sensor”
- **Data Type:** Identifies the data type in the frame, eg. “temperature”.

### Payload structure
<table style="width: 100%;">
<tbody>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>1 Byte</b></td>
<td style="font-size: 15px; padding: 10px;"><b>1 Byte</b></td>
<td style="font-size: 15px; padding: 10px;"><b>N Bytes</b></td>
<td style="font-size: 15px; padding: 10px;"><b>1 Byte</b></td>
<td style="font-size: 15px; padding: 10px;"><b>1 Byte</b></td>
<td style="font-size: 15px; padding: 10px;"><b>M Bytes</b></td>
<td style="font-size: 15px; padding: 10px;"><b> ... </b></td>
</tr>
<tr>
<td>Data1 Ch.</td>
<td>Data1 Type</td>
<td>Data1</td>
<td>Data2 Ch.</td>
<td>Data2 Type</td>
<td>Data2</td>
<td>...</td>
</tr>
</tbody>
</table>

### Data Types

Data Types conform to the IPSO Alliance Smart Objects Guidelines, which identifies each data type with an “Object ID”.  However, as shown below, a conversion is made to fit the Object ID into a single byte.

```
LPP_DATA_TYPE = IPSO_OBJECT_ID - 3200
```

Each data type can use 1 or more bytes to send the data according to the following table.

<table style="width: 100%;">
<tbody>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Type</b></td>
<td style="font-size: 15px; padding: 10px;"><b>IPSO</b></td>
<td style="font-size: 15px; padding: 10px;"><b>LPP</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Hex</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Data Size</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Data Resolution per bit</b></td>
</tr>
<tr>
<td>Digital Input</td>
<td>3200</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>Digital Output</td>
<td>3201</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>Analog Input</td>
<td>3202</td>
<td>2</td>
<td>2</td>
<td>2</td>
<td>0.01 Signed</td>
</tr>
<tr>
<td>Analog Output</td>
<td>3203</td>
<td>3</td>
<td>3</td>
<td>2</td>
<td>0.01 Signed</td>
</tr>
<tr>
<td>Illuminance Sensor</td>
<td>3301</td>
<td>101</td>
<td>65</td>
<td>2</td>
<td>1 Lux Unsigned MSB</td>
</tr>
<tr>
<td>Presence Sensor</td>
<td>3302</td>
<td>102</td>
<td>66</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>Temperature Sensor</td>
<td>3303</td>
<td>103</td>
<td>67</td>
<td>2</td>
<td>0.1 °C Signed MSB</td>
</tr>
<tr>
<td>Humidity Sensor</td>
<td>3304</td>
<td>104</td>
<td>68</td>
<td>1</td>
<td>0.5 % Unsigned</td>
</tr>
<tr>
<td>Accelerometer</td>
<td>3313</td>
<td>113</td>
<td>71</td>
<td>6</td>
<td>0.001 G Signed MSB per axis</td>
</tr>
<tr>
<td>Barometer</td>
<td>3315</td>
<td>115</td>
<td>73</td>
<td>2</td>
<td>0.1 hPa Unsigned MSB</td>
</tr>
<tr>
<td>Gyrometer</td>
<td>3334</td>
<td>134</td>
<td>86</td>
<td>6</td>
<td>0.01 °/s Signed MSB per axis</td>
</tr>
<tr>
<td rowspan="3">GPS Location</td>
<td rowspan="3">3336</td>
<td rowspan="3">136</td>
<td rowspan="3">88</td>
<td rowspan="3">9</td>
<td>Latitude : 0.0001 ° Signed MSB</td>
</tr>
<tr>
<td>Longitude : 0.0001 ° Signed MSB</td>
</tr>
<tr>
<td>Altitude : 0.01 meter Signed MSB</td>
</tr>
</tbody>
</table>

### Examples

#### Device with 2 temperature sensors

<table style="width: 100%;">
<tbody>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Payload (Hex)</b></td>
<td style="font-size: 15px; padding: 10px;" colspan="2">03 67 01 10 05 67 00 FF</td>
</tr>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Data Channel</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Type</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Value</b></td>
</tr>
<tr>
<td>03 ⇒ 3</td>
<td>67 ⇒ Temperature</td>
<td>0110 = 272 ⇒ 27.2°C</td>
</tr>
<tr>
<td>05 ⇒ 5</td>
<td>67 ⇒ Temperature</td>
<td>00FF = 255 ⇒ 25.5°C</td>
</tr>
</tbody>
</table>

#### Device with temperature and acceleration sensors

**Frame N**
<table style="width: 100%;">
<tbody>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Payload (Hex)</b></td>
<td style="font-size: 15px; padding: 10px;" colspan="2">01 67 FF D7</td>
</tr>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Data Channel</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Type</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Value</b></td>
</tr>
<tr>
<td>01 ⇒ 1</td>
<td>67 ⇒ Temperature</td>
<td>FFD7 = -41 ⇒ -4.1°C</td>
</tr>
</tbody>
</table>

**Frame N+1**
<table style="width: 100%;">
<tbody>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Payload (Hex)</b></td>
<td style="font-size: 15px; padding: 10px;" colspan="2">06 71 04 D2 <i>FB 2E</i> <i>00 00</i></td>
</tr>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Data Channel</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Type</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Value</b></td>
</tr>
<tr>
<td rowspan="3">06 ⇒ 6</td>
<td rowspan="3">71 ⇒ Accelerometer</td>
<td>X: 04D2 = +1234 ⇒ +1.234G</td>
</tr>
<tr>
<td><i>Y: FB2E = -1234 ⇒ -1.234G</i></td>
</tr>
<tr>
<td><i>Z: 0000 = 0 ⇒ 0G</i></td>
</tr>
</tbody>
</table>

#### Device with GPS

<table style="width: 100%;">
<tbody>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Payload (Hex)</b></td>
<td style="font-size: 15px; padding: 10px;" colspan="2">01 88 06 76 5f <i>f2 96 0a</i> <i>00 03 e8</i></td>
</tr>
<tr>
<td style="font-size: 15px; padding: 10px;"><b>Data Channel</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Type</b></td>
<td style="font-size: 15px; padding: 10px;"><b>Value</b></td>
</tr>
<tr>
<td rowspan="3">01 ⇒ 1</td>
<td rowspan="3">88 ⇒ GPS</td>
<td>Latitude: 06765f ⇒ 42.3519</td>
</tr>
<tr>
<td><i>Longitude: F2960a ⇒ -87.9094</i></td>
</tr>
<tr>
<td><i>Altitude: 0003E8 ⇒ 10 meters</i></td>
</tr>
</tbody>
</table>

### IPSO Smart Objects Reference

For full information about IPSO Smart Objects, see <a href="http://www.ipso-alliance.org/" target="_blank">http://www.ipso-alliance.org/</a>.

```
IPSO Smart Objects are based on the object model specified in OMA LightWeight M2M [1] Chapter 6, 
Identifiers and Resources.
					
An IPSO Smart Object is a specified collection of reusable resources (See Table 2, Reusable Resources) 
that has a well-known object ID (See Table 1, Smart Objects) and which represents a particular type of 
physical sensor, actuator, connected object or other data source. The reusable resources,which make up 
the Smart Object, represent static and dynamic properties of the connected physical object and the 
embedded software contained therein.
					
This document defines a set of IPSO Smart Objects, which conform to the OMA LWM2MObject Model, and 
which can be used as data objects, or web objects, to represent common sensors, actuators, and data 
sources.
					
Although OMA LWM2M is based on the IETF CoAP [2] protocol, these objects may be used with other 
transport protocols (e.g. HTTP [3] with REST [4]) by supporting the Content-Types and access methods 
defined in [1]. 
```
   IPSO Smart Objects Guideline - Starter Pack - Version 1.0 ©2014 IPSO Alliance
