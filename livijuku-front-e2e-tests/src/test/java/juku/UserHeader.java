package juku;

import java.util.Objects;

public enum UserHeader {
    USER("iv-user"),
    GROUPS("iv-groups"),
    ORGANIZATION("o"),
    DEPARTMENT("ou");

    public final String headerName;

    UserHeader(String headerName) {
        this.headerName = Objects.requireNonNull(headerName);
    }
}
