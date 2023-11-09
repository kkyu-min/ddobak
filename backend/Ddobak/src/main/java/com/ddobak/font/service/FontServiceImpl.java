package com.ddobak.font.service;

import com.ddobak.favorite.repository.FavoriteRepository;
import com.ddobak.font.dto.request.MakeFontRequest;
import com.ddobak.font.dto.response.FontDetailResponse;
import com.ddobak.font.dto.response.FontListResponse;
import com.ddobak.font.dto.response.FontResponse;
import com.ddobak.font.entity.Font;
import com.ddobak.font.entity.FontStatusType;
import com.ddobak.font.entity.Keyword;
import com.ddobak.font.exception.FontException;
import com.ddobak.font.repository.FontQueryRepository;
import com.ddobak.font.repository.FontRepository;
import com.ddobak.font.repository.KeywordRepository;
import com.ddobak.global.exception.ErrorCode;
import com.ddobak.member.entity.Member;
import com.ddobak.member.exception.MemberException;
import com.ddobak.member.repository.MemberRepository;
import com.ddobak.review.dto.response.ReviewResponse;
import com.ddobak.review.entity.Review;
import com.ddobak.review.repository.ReviewRepository;
import com.ddobak.review.service.ReviewService;
import com.ddobak.security.util.LoginInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FontServiceImpl implements FontService {

    private final FontRepository fontRepository;
    private final MemberRepository memberRepository;
    private final KeywordRepository keywordRepository;
    private final FontQueryRepository fontQueryRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewService reviewService;

    @Override
    public Long createFont(String font_sort_url, LoginInfo loginInfo){
        String email = loginInfo.email();

        Member member = memberRepository.findByEmail(email).orElseThrow(
                () -> new EntityNotFoundException("Member not found with email: " + email)
        );
        Font newFont = Font.from(font_sort_url,member, FontStatusType.FAIL);

        fontRepository.save(newFont);

        return newFont.getId();
    }

    @Override
    public Font makeFont(MakeFontRequest req, LoginInfo loginInfo, String fontUrl) {
        String email = loginInfo.email();
        Member member = memberRepository.findById(loginInfo.id())
                .orElseThrow(() -> new EntityNotFoundException("Member not found with email: " + loginInfo.id()));

        Font font = fontRepository.findById(req.fontId())
                .orElseThrow(() -> new EntityNotFoundException("Font not found with Id: " + req.fontId()));

        font.makeDetail(req);

        addKeywordToFont(req.keyword1(), font);
        Optional.ofNullable(req.keyword2()).ifPresent(keyword -> addKeywordToFont(keyword, font));
        Optional.ofNullable(req.keyword3()).ifPresent(keyword -> addKeywordToFont(keyword, font));

        fontRepository.save(font);

        return font;
    }

    private void addKeywordToFont(String keyword, Font font) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            Keyword keywordEntity = keywordRepository.findByKeyword(keyword)
                    .orElseGet(() -> {
                        Keyword newKeyword = new Keyword(keyword, font);
                        keywordRepository.save(newKeyword);
                        return newKeyword;
                    });
            font.getKeywords().add(keywordEntity);
        }
    }
    @Override
    public List<FontResponse> getFontList(LoginInfo loginInfo,Pageable pageable,String search, List<String> keywords, Boolean free) {
        //Integer fontCount = fontRepository.countAll();
        Optional<Member> member = memberRepository.findByEmail(loginInfo.email());
        Long member_id = member.get().getId();
        List<FontResponse> resultList = fontQueryRepository.getFontList(member_id,pageable,search, keywords,free);

        return resultList;
    }

    @Override
    public FontListResponse getFontListNoAuth(Pageable pageable,String search, List<String> keywords, Boolean free){
        //Integer fontCount = fontRepository.countAll();
        FontListResponse resultList = fontQueryRepository.getFontListNoAuth(pageable,search, keywords,free);

        return resultList;
    }

    @Async
    protected void plusViewCount(Font font){
        font.plusViewCount();
    }

    @Override
    public FontDetailResponse getFontDetail(Long fontId, LoginInfo loginInfo){
        Font font = fontQueryRepository.getFontWithKeywords(fontId);

        plusViewCount(font);

        Boolean dibCheck = favoriteRepository.existsByMemberIdAndFontId(loginInfo.id(), fontId);

//        Boolean dibCheck =true;
        List<String> fontKeywords = new ArrayList<>();

        for(Keyword k : font.getKeywords()){
            fontKeywords.add(k.getKeyword());
        }

        List<ReviewResponse> reviewResponseList = reviewService.findReviewByFontId(font.getId());

        Long reviewCount = reviewResponseList.stream().count();

        Long dibCount = favoriteRepository.countByFontId(fontId);

        FontDetailResponse result = new FontDetailResponse(fontId,dibCheck,font.getProducer().getNickname(), font.getViewCount(),fontKeywords,font.getIntroduce_text(),font.getFont_file_url(),dibCount, font.getKor_font_name(),font.getPrice(),reviewCount, reviewResponseList);


        return result;
    }

    public Font findByFontId(Long id) {
        return fontRepository.findAllById(id).orElseThrow(() -> new FontException(ErrorCode.FONT_NOT_FOUND));
    }
}

