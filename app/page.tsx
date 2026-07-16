"use client";

import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  // Kakao Maps SDK is loaded dynamically and does not ship TypeScript definitions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { kakao: any }
}

type Place = {
  id: string; type: "restaurant" | "bar"; name: string; genre: string;
  rating: number; address: string; hours: string; menu: string;
  summary: string; price?: string; drink?: string; drinkPrice?: number | null;
  note?: string; lat: number; lng: number;
};

const PLACES: Place[] = [
  { id:"viet", type:"restaurant", name:"인더비엣 한양대에리카점", genre:"베트남 음식", rating:4.8, address:"경기 안산시 상록구 성안길 78-3", hours:"10:30–22:30", price:"1만–1만 7천원대", menu:"소고기쌀국수 · 팟타이 · 반쎄오", summary:"쌀국수부터 반쎄오까지 메뉴 폭이 넓고 혼밥과 모임에 모두 적합합니다.", lat:37.2974, lng:126.8389 },
  { id:"pnp", type:"restaurant", name:"파앤피파스타하우스", genre:"파스타 · 피자", rating:4.7, address:"경기 안산시 상록구 학사2길 6", hours:"10:00–21:00", price:"9천–1만 7천원대", menu:"까르보나라 · 알리오올리오 · 피자", summary:"학생 가격대의 파스타와 피자 세트가 강점인 정문 앞 양식당입니다.", lat:37.2964, lng:126.8362 },
  { id:"sot", type:"restaurant", name:"동양솥밥 한양대에리카점", genre:"솥밥 · 한식", rating:4.6, address:"경기 안산시 상록구 한양대학로 48", hours:"10:00–21:40", price:"8천–1만 2천원대", menu:"규동솥밥 · 스테이크솥밥", summary:"누룽지까지 즐길 수 있는 든든한 한 끼로 깔끔한 식사를 원할 때 좋습니다.", lat:37.2969, lng:126.8374 },
  { id:"saray", type:"restaurant", name:"사라이도네르케밥 2호점", genre:"튀르키예 음식", rating:4.5, address:"경기 안산시 상록구 한양대학로 45-1", hours:"방문 전 확인", price:"8천–1만 4천원대", menu:"되네르케밥 · 라이스 플레이트", summary:"치킨과 양고기를 고를 수 있는 케밥 전문점으로 이국적인 한 끼에 적합합니다.", lat:37.2961, lng:126.8368 },
  { id:"mara", type:"restaurant", name:"탕화쿵푸마라탕 한양대에리카점", genre:"마라탕", rating:4.3, address:"경기 안산시 상록구 성안길 78-3", hours:"10:00–22:00", price:"중량별 과금", menu:"마라탕 · 마라샹궈 · 볶음밥", summary:"재료와 맵기를 직접 고르는 방식이며 넓은 좌석과 셀프바를 갖췄습니다.", lat:37.2972, lng:126.8390 },
  { id:"jjigae", type:"restaurant", name:"찌개찌개", genre:"한식 · 백반", rating:4.1, address:"경기 안산시 상록구 한양대학로 60", hours:"방문 전 확인", price:"7천원대", menu:"닭매운탕 · 제육볶음", summary:"7천원대 한식 메뉴와 넉넉한 양으로 가성비가 좋은 대학가 식당입니다.", lat:37.2970, lng:126.8395 },
  { id:"road", type:"bar", name:"로드락비어 안산한양대점", genre:"비어펍", rating:4.6, address:"경기 안산시 상록구 성안길 78-3", hours:"16:00–02:00", drink:"생맥주", drinkPrice:1900, note:"공개 홍보가 기준", menu:"흑돼지 후라이드 · 돼지갈비", summary:"가벼운 생맥주와 튀김 안주를 함께 즐기기 좋은 캐주얼 비어펍입니다.", lat:37.2973, lng:126.8389 },
  { id:"aplus", type:"bar", name:"A+ 에이플러스", genre:"대학가 주점", rating:4.4, address:"경기 안산시 상록구 사동 1562-6", hours:"17:00–05:00 · 학기 중", drink:"소주", drinkPrice:3000, note:"공개 행사 최저가", menu:"포차 안주 · 심야 메뉴", summary:"ERICA 정문 앞 학기 중 운영 주점으로 단체 방문과 늦은 시간 이용에 적합합니다.", lat:37.2958, lng:126.8379 },
  { id:"manchi", type:"bar", name:"만취", genre:"대형 주점", rating:4.2, address:"경기 안산시 상록구 한양대학로 36 2층", hours:"17:00–04:00", drink:"소주 · 맥주", drinkPrice:null, note:"현재 가격 확인 필요", menu:"주점 안주 · 단체 메뉴", summary:"넓은 공간과 늦은 영업시간이 특징으로 단체 모임에 적합한 주점입니다.", lat:37.2956, lng:126.8366 },
  { id:"daldal", type:"bar", name:"달달포차", genre:"포장마차", rating:4.0, address:"한양대학교 ERICA 쪽문 앞", hours:"월–토 17:30–마감 변동", drink:"소주 · 맥주", drinkPrice:null, note:"현재 가격 확인 필요", menu:"포차 안주 · 단체 메뉴", summary:"쪽문에서 가까우며 단체 예약이 가능한 포장마차입니다.", lat:37.2980, lng:126.8356 },
  { id:"gyoban", type:"bar", name:"교반", genre:"한식 포차", rating:3.8, address:"한양대학교 ERICA 정문 앞", hours:"평일 11:00–03:00", drink:"소주 · 맥주", drinkPrice:null, note:"현재 가격 확인 필요", menu:"육회비빔밥 · 포차 안주", summary:"낮에는 식사, 저녁에는 포차로 운영되는 정문 앞 한식 주점입니다.", lat:37.2967, lng:126.8378 },
];

const won = (price?: number | null) => price == null ? "가격 확인 필요" : `${price.toLocaleString("ko-KR")}원`;

export default function Home() {
  const [category, setCategory] = useState<"restaurant"|"bar">("restaurant");
  const [rating, setRating] = useState(3.5);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("viet");
  const [mobileMap, setMobileMap] = useState(false);
  const [mapState, setMapState] = useState<"loading"|"ready"|"error">("loading");
  const mapElement = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kakaoMap = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapPlaces = useRef<Map<string,{ marker:any; position:any; info:any }>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInfo = useRef<any>(null);

  const shown = useMemo(() => PLACES
    .filter(p => p.type === category && p.rating >= rating)
    .filter(p => `${p.name} ${p.genre} ${p.menu}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a,b) => category === "restaurant" ? b.rating-a.rating : (a.drinkPrice ?? 999999)-(b.drinkPrice ?? 999999) || b.rating-a.rating), [category,rating,query]);
  const shownKey = shown.map(p=>p.id).join(",");
  const selectedPlace = shown.find(p=>p.id===selected);

  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      try {
        const response = await fetch("/api/map-config");
        const { kakaoMapJavaScriptKey } = await response.json();
        if (!kakaoMapJavaScriptKey) throw new Error("missing kakao map key");
        const initialize = () => window.kakao.maps.load(() => {
          if (cancelled || !mapElement.current) return;
          const center = new window.kakao.maps.LatLng(37.2968, 126.8375);
          const map = new window.kakao.maps.Map(mapElement.current, { center, level: 4 });
          map.addControl(new window.kakao.maps.MapTypeControl(), window.kakao.maps.ControlPosition.TOPRIGHT);
          map.addControl(new window.kakao.maps.ZoomControl(), window.kakao.maps.ControlPosition.RIGHT);
          kakaoMap.current = map;
          setMapState("ready");
        });
        if (window.kakao?.maps) return initialize();
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(kakaoMapJavaScriptKey)}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = initialize;
        script.onerror = () => !cancelled && setMapState("error");
        document.head.appendChild(script);
      } catch {
        if (!cancelled) setMapState("error");
      }
    };
    start();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (mapState !== "ready" || !kakaoMap.current) return;
    const kakao = window.kakao;
    const map = kakaoMap.current;
    mapInfo.current?.close();
    mapPlaces.current.forEach(({marker}) => marker.setMap(null));
    mapPlaces.current.clear();
    const bounds = new kakao.maps.LatLngBounds();
    const geocoder = new kakao.maps.services.Geocoder();
    let completed = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addMarker = (place:Place, position:any) => {
      const marker = new kakao.maps.Marker({ map, position, title: place.name });
      const info = new kakao.maps.InfoWindow({
        removable: true,
        content: `<div class="kakao-info"><b>${place.name}</b><span>★ ${place.rating.toFixed(1)} · ${place.genre}</span></div>`
      });
      kakao.maps.event.addListener(marker, "click", () => {
        mapInfo.current?.close();
        info.open(map, marker);
        mapInfo.current = info;
        map.panTo(position);
        setSelected(place.id);
      });
      mapPlaces.current.set(place.id, {marker,position,info});
      bounds.extend(position);
      completed += 1;
      if (completed === shown.length && shown.length > 1) map.setBounds(bounds, 55, 55, 55, 55);
      if (place.id === selected) {
        info.open(map, marker);
        mapInfo.current = info;
      }
    };

    shown.forEach(place => {
      const fallback = new kakao.maps.LatLng(place.lat, place.lng);
      if (!place.address.startsWith("경기")) return addMarker(place, fallback);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      geocoder.addressSearch(place.address.replace(/\s\d+층$/, ""), (result:any[], status:string) => {
        const position = status === kakao.maps.services.Status.OK && result[0]
          ? new kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))
          : fallback;
        addMarker(place, position);
      });
    });
    if (shown.length === 0) map.setCenter(new kakao.maps.LatLng(37.2968, 126.8375));
    // shownKey intentionally represents the filtered place collection without
    // rebuilding every marker when only the selected card changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapState, shownKey]);

  useEffect(() => {
    if (mapState !== "ready" || !kakaoMap.current) return;
    const current = mapPlaces.current.get(selected);
    if (!current) return;
    mapInfo.current?.close();
    current.info.open(kakaoMap.current, current.marker);
    mapInfo.current = current.info;
    kakaoMap.current.panTo(current.position);
  }, [selected,mapState]);

  useEffect(() => {
    if (!mobileMap || mapState !== "ready" || !kakaoMap.current) return;
    const timer = window.setTimeout(() => {
      kakaoMap.current.relayout();
      const current = mapPlaces.current.get(selected);
      if (current) kakaoMap.current.setCenter(current.position);
    }, 80);
    return () => window.clearTimeout(timer);
  }, [mobileMap,mapState,selected]);

  const switchCategory = (next:"restaurant"|"bar") => {
    setCategory(next); setSelected(next === "restaurant" ? "viet" : "road");
  };

  return <main>
    <header className="site-header"><a className="brand" href="#top"><span>E</span> ERICA PICK</a><p>한양대 ERICA 앞, 실패 없는 한 끼와 한 잔</p></header>
    <section className="hero" id="top"><small>2026 ERICA LOCAL GUIDE</small><h1>오늘 어디 갈지<br/>30초 안에 고르세요.</h1><p>평점 3.5 이상 매장만 모아, 맛집은 높은 평점순으로 술집은 확인된 최저 주류 가격순으로 정리했습니다.</p></section>
    <nav className="tabs"><button className={category==="restaurant"?"active":""} onClick={()=>switchCategory("restaurant")}>맛집 <b>6</b></button><button className={category==="bar"?"active":""} onClick={()=>switchCategory("bar")}>술집 <b>5</b></button></nav>
    <section className="toolbar"><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="매장이나 메뉴 검색"/></label><label className="rating"><span>평점</span><select value={rating} onChange={e=>setRating(Number(e.target.value))}><option value="3.5">3.5 이상</option><option value="4">4.0 이상</option><option value="4.5">4.5 이상</option><option value="5">5.0</option></select></label><button className="map-toggle" onClick={()=>setMobileMap(v=>!v)}>{mobileMap?"목록 보기":"지도 보기"}</button></section>
    <section className={`explore ${mobileMap?"mobile-map":""}`}>
      <div className="results"><div className="results-title"><strong>{shown.length}곳</strong><span>{category==="restaurant"?"평점 높은 순":"주류 최저가 순"}</span></div><div className="cards">
        {shown.map(p=><article key={p.id} className={`card ${selected===p.id?"selected":""}`} onClick={()=>setSelected(p.id)}><div className="kicker"><span>{p.genre}</span><b>★ {p.rating.toFixed(1)}</b></div><h2>{p.name}</h2><p>{p.summary}</p><dl><div><dt>대표</dt><dd>{p.menu}</dd></div><div><dt>{category==="bar"?"최저 주류":"가격대"}</dt><dd>{category==="bar"?`${p.drink} · ${won(p.drinkPrice)}`:p.price}</dd></div><div><dt>영업</dt><dd>{p.hours}</dd></div></dl>{p.note&&<em>{p.note}</em>}<footer><span>{p.address}</span><a href={`https://map.kakao.com/link/search/${encodeURIComponent(p.name)}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>지도에서 보기 ↗</a></footer></article>)}
        {shown.length===0&&<div className="empty"><strong>조건에 맞는 매장이 없습니다.</strong><span>평점이나 검색어를 조정해 보세요.</span></div>}
      </div></div>
      <div className="map-box">
        <div ref={mapElement} className="map-canvas" role="application" aria-label="한양대 ERICA 주변 카카오 지도"/>
        {mapState!=="ready"&&<div className={`map-status ${mapState}`}><strong>{mapState==="loading"?"카카오맵을 불러오는 중입니다":"카카오맵 연결을 확인해 주세요"}</strong><span>{mapState==="error"?"JavaScript 키의 웹 도메인 등록 상태를 확인하면 지도가 표시됩니다.":"매장 위치와 도보권을 지도에 표시하고 있습니다."}</span></div>}
        <div className="map-label"><i/>Kakao Map · ERICA 정문 도보권</div>
        <div className="selected-place"><span><small>선택한 장소</small>{selectedPlace?.name??"매장을 선택하세요"}</span>{selectedPlace&&<a href={`https://map.kakao.com/link/search/${encodeURIComponent(selectedPlace.name)}`} target="_blank" rel="noreferrer">길찾기 ↗</a>}</div>
      </div>
    </section>
    <div className="page-footer"><strong>ERICA PICK</strong><p>2026년 7월 공개 매장 정보 기준 · 평점과 가격은 변동될 수 있으므로 방문 전 확인하세요.</p></div>
  </main>;
}
