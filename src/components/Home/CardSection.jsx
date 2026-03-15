import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { getCampainer } from "@/store/campaigners/campaigners.service";
import CustomCard from "../utils/CustomCard";
import CustomCardSkeleton from "../utils/CustomCardSkeleton";
import { Input } from "../ui/input";

const PAGE_SIZE = 15;
const INITIAL_QUERY = {
  page: 1,
  search: "",
};

const INITIAL_LIST_STATE = {
  campaigners: [],
  campainersCount: 0,
  campaginerTotalPages: 0,
  campainerLoading: false,
};

const queryReducer = (state, action) => {
  switch (action.type) {
    case "RESET_PAGE":
      if (state.page === INITIAL_QUERY.page) {
        return state;
      }

      return {
        ...state,
        page: INITIAL_QUERY.page,
      };

    case "SET_SEARCH":
      if (
        state.search === action.payload &&
        state.page === INITIAL_QUERY.page
      ) {
        return state;
      }

      return {
        page: INITIAL_QUERY.page,
        search: action.payload,
      };

    case "LOAD_NEXT_PAGE":
      return {
        ...state,
        page: state.page + 1,
      };

    default:
      return state;
  }
};

const listReducer = (state, action) => {
  switch (action.type) {
    case "RESET":
      return INITIAL_LIST_STATE;

    case "REQUEST_START":
      return {
        ...state,
        campainerLoading: true,
      };

    case "REQUEST_SUCCESS": {
      const { queryPage, payload } = action;
      const nextCampaigners = payload?.campaigners ?? [];
      const totalPages = payload?.totalPages ?? 0;
      const count = payload?.count ?? 0;

      if (queryPage === 1) {
        return {
          campaigners: nextCampaigners,
          campainersCount: count,
          campaginerTotalPages: totalPages,
          campainerLoading: false,
        };
      }

      const mergedCampaigners = [...state.campaigners, ...nextCampaigners];
      const uniqueCampaigners = Array.from(
        new Map(
          mergedCampaigners.map((campaigner, index) => [
            campaigner?._id ?? `${queryPage}-${index}`,
            campaigner,
          ]),
        ).values(),
      );

      return {
        campaigners: uniqueCampaigners,
        campainersCount: count,
        campaginerTotalPages: totalPages,
        campainerLoading: false,
      };
    }

    case "REQUEST_FINISH":
      return {
        ...state,
        campainerLoading: false,
      };

    default:
      return state;
  }
};

const CardSection = ({ currentCampaign }) => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [query, dispatchQuery] = useReducer(queryReducer, INITIAL_QUERY);
  const [listState, dispatchList] = useReducer(listReducer, INITIAL_LIST_STATE);

  const loaderRef = useRef(null);
  const isFetchingNextPageRef = useRef(false);
  const lastTriggeredPageRef = useRef(INITIAL_QUERY.page);

  const {
    campaigners,
    campainersCount,
    campaginerTotalPages,
    campainerLoading,
  } = listState;

  const hasMoreCampaigners = useMemo(() => {
    if (campaginerTotalPages > 0) {
      return query.page < campaginerTotalPages;
    }

    return campaigners.length < campainersCount;
  }, [campaginerTotalPages, campaigners.length, campainersCount, query.page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatchQuery({
        type: "SET_SEARCH",
        payload: searchInput.trim(),
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    dispatchList({ type: "RESET" });
    dispatchQuery({ type: "RESET_PAGE" });
  }, [currentCampaign?._id]);

  useEffect(() => {
    isFetchingNextPageRef.current = campainerLoading;
  }, [campainerLoading]);

  useEffect(() => {
    lastTriggeredPageRef.current = query.page;
  }, [query.page]);

  useEffect(() => {
    if (!currentCampaign?._id) return undefined;

    let isActive = true;
    dispatchList({ type: "REQUEST_START" });

    const request = dispatch(
      getCampainer({
        id: currentCampaign._id,
        status: "active",
        campStatus: "active",
        page: query.page,
        pageSize: PAGE_SIZE,
        search: query.search,
        infiniteScroll: true,
      }),
    );

    request
      .unwrap()
      .then((payload) => {
        if (!isActive) return;

        dispatchList({
          type: "REQUEST_SUCCESS",
          queryPage: query.page,
          payload,
        });
      })
      .catch(() => {
        if (!isActive) return;
      })
      .finally(() => {
        if (!isActive) return;

        dispatchList({ type: "REQUEST_FINISH" });
      });

    return () => {
      isActive = false;
      request.abort();
    };
  }, [currentCampaign?._id, dispatch, query]);

  useEffect(() => {
    const currentLoader = loaderRef.current;

    if (!currentLoader || !currentCampaign?._id || !hasMoreCampaigners) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || isFetchingNextPageRef.current) return;

        if (campaginerTotalPages > 0 && query.page >= campaginerTotalPages) {
          return;
        }

        if (lastTriggeredPageRef.current !== query.page) {
          return;
        }

        isFetchingNextPageRef.current = true;
        lastTriggeredPageRef.current = query.page + 1;
        dispatchQuery({ type: "LOAD_NEXT_PAGE" });
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(currentLoader);

    return () => {
      observer.unobserve(currentLoader);
      observer.disconnect();
    };
  }, [
    campaginerTotalPages,
    currentCampaign?._id,
    hasMoreCampaigners,
    query.page,
  ]);

  const isInitialLoading = campainerLoading && campaigners.length === 0;
  const isLoadingMore = campainerLoading && campaigners.length > 0;

  return (
    <section className="mt-10" id="card-sections">
      <div className="mb-5 flex flex-col justify-between gap-2 px-2 md:flex-row">
        <h2 className="text font-semibold md:text-2xl">
          Campaigners Supporting This Seva ({campainersCount})
        </h2>

        <Input
          placeholder="Search campaigner..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="mb-3 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {campaigners?.map((campaginer, index) => (
          <CustomCard
            key={campaginer?._id ?? campaginer?.slug ?? `${index}-${query.search}`}
            campainer={campaginer}
            index={index}
          />
        ))}

        {isInitialLoading &&
          Array.from({ length: Math.min(PAGE_SIZE, 4) }).map((_, i) => (
            <CustomCardSkeleton key={i} />
          ))}
      </div>

      {isLoadingMore && (
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-amber-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading more campaigners...</span>
        </div>
      )}

      {hasMoreCampaigners && <div ref={loaderRef} className="h-10" />}

      {!campainerLoading && campaigners?.length === 0 && (
        <p>No Campaigners Found.</p>
      )}
    </section>
  );
};

export default CardSection;
